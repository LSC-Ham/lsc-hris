"use server";

// Add bcrypt import if you don't have it
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma"; // Adjust this import based on your setup
import { revalidatePath } from "next/cache";

export async function createEmployee(data: any) {
    try {
        const division = await prisma.divisions.findFirst({
            where: { division: data.division },
        });

        const department = await prisma.departments.findFirst({
            where: { department: data.department },
        });

        if (!division || !department) {
            return { error: "Invalid Division or Department selected." };
        }

        // Generate the temporary password
        const rawPassword = "lakeshore123";
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create User with Username and Email
            const newUser = await tx.user.create({
                data: {
                    username: data.id_number,
                    email: data.email || null, // Ensure email is saved to the User model
                    password: hashedPassword,
                    password_changed: false,
                }
            });

            // 2. Create Biography and Employee (Your existing logic)
            const biographyRecord = await tx.biography.create({
                data: {
                    users_id: newUser.id,
                    employees: {
                        create: {
                            id_number: data.id_number,
                            hired_at: data.hired_at ? new Date(data.hired_at) : null,
                            divisions_id: division.id,
                            departments_id: department.id,
                            remarks: data.remarks,
                        }
                    },
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
                            email: data.email, // Kept here as well based on your previous schema
                            nationality: data.nationality,
                            height: data.height,
                            weight: data.weight,
                            blood_type: data.blood_type,
                        }
                    }
                },
                include: { employees: true }
            });

            const realEmployeeId = biographyRecord.employees?.id;
            if (!realEmployeeId) throw new Error("Failed to create the employee relation.");

            // 3. Handle Positions (Your existing logic)
            const positionNames = data.positions?.map((p: any) => p.position) || [];
            const foundPositions = await tx.positions.findMany({
                where: { position: { in: positionNames } },
            });
            const positionMap = new Map(foundPositions.map((p) => [p.position, p.id]));

            const positionInserts = (data.positions || [])
                .map((p: any) => {
                    const posId = positionMap.get(p.position);
                    if (!posId) return null;
                    return {
                        employees_id: realEmployeeId,
                        positions_id: posId,
                        status: p.status,
                        description: p.description,
                        is_active: Boolean(p.is_active),
                        start_at: p.start_at ? new Date(p.start_at) : null,
                        end_at: p.end_at ? new Date(p.end_at) : null,
                    };
                })
                .filter(Boolean);

            if (positionInserts.length > 0) {
                await tx.employees_positions.createMany({ data: positionInserts });
            }

            // 4. Handle Gov IDs (Your existing logic)
            const govIdInserts: any[] = [];
            if (data.gsis_no) govIdInserts.push({ id_label: "GSIS No.", id_number: data.gsis_no, employees_id: realEmployeeId });
            if (data.pagibig_no) govIdInserts.push({ id_label: "Pag-IBIG No.", id_number: data.pagibig_no, employees_id: realEmployeeId });
            if (data.philhealth_no) govIdInserts.push({ id_label: "PhilHealth No.", id_number: data.philhealth_no, employees_id: realEmployeeId });
            if (data.sss_no) govIdInserts.push({ id_label: "SSS No.", id_number: data.sss_no, employees_id: realEmployeeId });
            if (data.tin_no) govIdInserts.push({ id_label: "TIN No.", id_number: data.tin_no, employees_id: realEmployeeId });
            if (data.agency_no) govIdInserts.push({ id_label: "Agency No.", id_number: data.agency_no, employees_id: realEmployeeId });

            if (govIdInserts.length > 0) {
                await tx.employees_govIDs.createMany({ data: govIdInserts });
            }

            return {
                id: realEmployeeId,
                username: newUser.username,
                email: newUser.email
            };
        });

        revalidatePath("/employees");

        return {
            success: true,
            id: result.id,
            username: result.username,
            email: result.email,
            tempPassword: rawPassword
        };

    } catch (error) {
        console.error("Create Employee Error:", error);
        return { error: "Failed to create employee account." };
    }
}