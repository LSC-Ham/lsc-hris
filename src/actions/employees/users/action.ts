"use server";

import { prisma } from "@/lib/prisma"; // Adjust this import to your actual Prisma client location
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt"; // Requires: npm install bcryptjs\
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function createEmployee(data: any) {
    try {
        // 1. Resolve Division & Department Names to IDs
        const division = await prisma.divisions.findFirst({
            where: { division: data.division },
        });

        const department = await prisma.departments.findFirst({
            where: { department: data.department },
        });

        if (!division || !department) {
            return { error: "Invalid Division or Department selected." };
        }

        // 2. Resolve Position Names to UUIDs
        const positionNames = data.positions?.map((p: any) => p.position) || [];
        const foundPositions = await prisma.positions.findMany({
            where: { position: { in: positionNames } },
        });
        const positionMap = new Map(foundPositions.map((p) => [p.position, p.id]));

        // 3. Prepare Gov IDs Array
        const govIdInserts: any[] = [];
        if (data.gsis_no) govIdInserts.push({ id_label: "GSIS No.", id_number: data.gsis_no });
        if (data.pagibig_no) govIdInserts.push({ id_label: "Pag-IBIG No.", id_number: data.pagibig_no });
        if (data.philhealth_no) govIdInserts.push({ id_label: "PhilHealth No.", id_number: data.philhealth_no });
        if (data.sss_no) govIdInserts.push({ id_label: "SSS No.", id_number: data.sss_no });
        if (data.tin_no) govIdInserts.push({ id_label: "TIN No.", id_number: data.tin_no });
        if (data.agency_no) govIdInserts.push({ id_label: "Agency No.", id_number: data.agency_no });

        // 4. Hash the default password BEFORE starting the transaction
        const hashedPassword = await bcrypt.hash("lakeshore123", 10);

        // 5. Execute Database Transaction
        const newEmployeeId = await prisma.$transaction(async (tx) => {

            // A. Create the User Account FIRST
            // Using id_number as the username so they have a guaranteed way to log in
            const newUser = await tx.user.create({
                data: {
                    password: hashedPassword,
                    password_changed: false,
                }
            });

            // B. Create Employee Profile using the new User's ID
            const employee = await tx.employees.create({
                data: {
                    users_id: newUser.id,
                    id_number: data.id_number,
                    hired_at: data.hired_at ? new Date(data.hired_at) : null,
                    divisions_id: division.id,
                    departments_id: department.id,
                    remarks: data.remarks,
                    personal_information: {
                        create: {
                            firstname: data.firstname,
                            surname: data.surname,
                            middlename: data.middlename,
                            extension: data.extension,
                            birthdate: data.birthdate ? new Date(data.birthdate) : null,
                            birthplace: data.birthplace,
                            sex: data.sex,
                            civil_status: data.civil_status,
                            telephone_no: data.telephone_no,
                            mobile_no: data.mobile_no,
                            email: data.email,
                            nationality: data.nationality,
                            height: data.height,
                            weight: data.weight,
                            blood_type: data.blood_type,
                        }
                    }
                },
            });

            // C. Insert Position History
            const positionInserts = (data.positions || [])
                .map((p: any) => {
                    const posId = positionMap.get(p.position);
                    if (!posId) return null;
                    return {
                        employees_id: employee.id,
                        positions_id: posId,
                        status: p.status,
                        description: p.description,
                        start_at: p.start_at ? new Date(p.start_at) : null,
                        end_at: p.end_at ? new Date(p.end_at) : null,
                    };
                })
                .filter(Boolean);

            if (positionInserts.length > 0) {
                await tx.employees_positions.createMany({ data: positionInserts });
            }

            // D. Insert Government IDs
            // Map the employee.id onto the objects we prepared earlier
            const mappedGovIds = govIdInserts.map(g => ({ ...g, employees_id: employee.id }));
            if (mappedGovIds.length > 0) {
                await tx.employees_govIDs.createMany({ data: mappedGovIds });
            }

            // Return the employee ID so we can pass it to the frontend for redirection
            return employee.id;
        });

        // 6. Revalidate cache so the new employee shows up immediately in lists
        revalidatePath("/employees");

        return { success: true, id: newEmployeeId };

    } catch (error) {
        console.error("Create Employee Error:", error);
        return { error: "Failed to create employee account. Please check your inputs and try again." };
    }
}

export async function getUsers(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, profile_picture: true, email: true,
            }
        });

        if (!user) return null

        return {
            id: user.id,
            profile_picture: user.profile_picture,
            email: user.email
        };

    } catch (error) {
        console.error("Failed to fetch profile picture:", error);
        return null;
    }
}

export async function updateEmail(newEmail: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const userId = (session.user as any).id;

    try {
        // 1. Check if email is already taken by another user
        const existingUser = await prisma.user.findUnique({ where: { email: newEmail } });
        if (existingUser && existingUser.id !== userId) {
            return { error: "This email is already in use by another account." };
        }

        // 2. Update the user
        await prisma.user.update({
            where: { id: userId },
            data: { email: newEmail },
        });

        return { success: true };
    } catch (error) {
        console.error("Update Email Error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function changePassword(currentPassword: string, newPassword: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const userId = (session.user as any).id;

    try {
        // 1. Fetch user to get their current hashed password
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.password) return { error: "User not found or password not set." };

        // 2. Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return { error: "The current password you entered is incorrect." };
        }

        // 3. Hash the new password and update
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedNewPassword,
                password_changed: true // Updating your schema boolean!
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Change Password Error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function deleteProfilePicture(userId: string) {
    if (!userId) throw new Error('User ID is required');

    try {
        // 1. Get the current user to find the file path
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { profile_picture: true }
        });

        // 2. If they have a picture, delete it from the filesystem
        if (user?.profile_picture) {
            // This assumes your DB path looks like "/uploads/filename.jpg"
            const filepath = path.join(process.cwd(), 'public', user.profile_picture);

            try {
                await fs.unlink(filepath);
            } catch (fsError) {
                // We catch this in case the file was already deleted manually
                console.warn("File already deleted or not found on disk:", fsError);
            }
        }

        // 3. Update the database to remove the image path
        await prisma.user.update({
            where: { id: userId },
            data: { profile_picture: null }
        });

        return { success: true };
    } catch (error) {
        console.error("Error deleting profile picture:", error);
        return { success: false, error: "Failed to delete profile picture" };
    }
}

export async function uploadProfilePicture(formData: FormData) {
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
        return { success: false, error: 'File and User ID are required' };
    }

    try {
        // 1. ✨ NEW: Check if the user already has a picture and delete the old file
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { profile_picture: true }
        });

        if (existingUser?.profile_picture) {
            const oldFilePath = path.join(process.cwd(), 'public', existingUser.profile_picture);
            try {
                await fs.unlink(oldFilePath);
                console.log("Old profile picture deleted successfully.");
            } catch (err) {
                // Ignore errors if the file was already missing
                console.warn("Could not delete old file (it may not exist):", err);
            }
        }

        // 2. Save the NEW file to the filesystem
        const buffer = Buffer.from(await file.arrayBuffer());
        // Create a unique filename so browsers don't cache the old image
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `profile-${userId}-${uniqueSuffix}.jpg`;

        // Ensure your uploads directory exists
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        const newFilePath = path.join(uploadDir, filename);
        await fs.writeFile(newFilePath, buffer);

        // 3. Update the database with the new path
        const dbImagePath = `/uploads/${filename}`;
        await prisma.user.update({
            where: { id: userId },
            data: { profile_picture: dbImagePath }
        });

        return { success: true, imagePath: dbImagePath };

    } catch (error) {
        console.error("Upload Error:", error);
        return { success: false, error: 'Failed to upload profile picture' };
    }
}