"use server";

import { prisma } from "@/lib/prisma"; // Adjust path if needed
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt"; // Requires: npm install bcryptjs
import path from 'path';
import { writeFile } from 'fs/promises';

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
                    id: newUser.id, // <--- Links the Employee to the User perfectly
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

export async function uploadProfilePicture(formData: FormData) {
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
        throw new Error('Missing file or user ID');
    }

    // 1. Convert the file into a buffer so Node.js can save it
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Create a unique filename and save it to your public/uploads folder
    const filename = `user-${userId}-${Date.now()}.jpg`;
    const filepath = path.join(process.cwd(), 'public/uploads', filename);

    // Write the file to the local filesystem
    await writeFile(filepath, buffer);

    // 3. Update the database with the new URL path
    const dbImagePath = `/uploads/${filename}`;

    await prisma.user.update({
        where: { id: userId },
        data: { profile_picture: dbImagePath }
    });

    return { success: true, imagePath: dbImagePath };
}