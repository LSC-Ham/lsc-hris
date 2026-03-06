"use server";

import { prisma } from "@/lib/prisma"; // Adjust this import to your actual Prisma client location
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt"; // Requires: npm install bcryptjs\

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
                            email: data.email,
                            nationality: data.nationality,
                            height: data.height,
                            weight: data.weight,
                            blood_type: data.blood_type,
                        }
                    }
                },
                // 👇 THIS IS THE CRUCIAL ADDITION
                include: {
                    employees: true
                }
            });

            // Extract the actual Employee ID
            const realEmployeeId = biographyRecord.employees?.id;

            if (!realEmployeeId) {
                throw new Error("Failed to create the employee relation.");
            }

            // C. Insert Position History
            const positionInserts = (data.positions || [])
                .map((p: any) => {
                    const posId = positionMap.get(p.position);
                    if (!posId) return null;
                    return {
                        employees_id: realEmployeeId, // 👇 USE THE REAL ID HERE
                        positions_id: posId,
                        status: p.status,
                        description: p.description,
                        is_active: Boolean(p.is_active), // <--- ADDED: Save the active state here too!
                        start_at: p.start_at ? new Date(p.start_at) : null,
                        end_at: p.end_at ? new Date(p.end_at) : null,
                    };
                })
                .filter(Boolean);

            if (positionInserts.length > 0) {
                await tx.employees_positions.createMany({ data: positionInserts });
            }

            // D. Insert Government IDs
            // 👇 USE THE REAL ID HERE TOO
            const mappedGovIds = govIdInserts.map(g => ({ ...g, employees_id: realEmployeeId }));
            if (mappedGovIds.length > 0) {
                await tx.employees_govIDs.createMany({ data: mappedGovIds });
            }

            // Return the REAL employee ID so we can pass it to the frontend for redirection
            return realEmployeeId;
        });

        // 6. Revalidate cache so the new employee shows up immediately in lists
        revalidatePath("/employees");

        return { success: true, id: newEmployeeId };

    } catch (error) {
        console.error("Create Employee Error:", error);
        return { error: "Failed to create employee account. Please check your inputs and try again." };
    }
}