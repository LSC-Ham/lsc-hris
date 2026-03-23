"use server";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function generateTempPassword() {
    return crypto.randomBytes(4).toString('hex');
}

export async function createEmployee(data: any) {
    try {
        const division = await prisma.divisions.findFirst({
            where: { division: data.division },
        });

        const department = await prisma.departments.findFirst({
            where: { department: data.department },
        });
        const rank = await prisma.ranks.findFirst({
            where: { rank: data.rank },
        });

        if (!division || !department || !rank) {
            return { error: "Invalid Division or Department selected." };
        }

        const rawPassword = generateTempPassword();
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const result = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    username: data.id_number,
                    email: data.email || null,
                    password: hashedPassword,
                    password_changed: false,
                }
            });

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
                            ranks_id: rank.id,
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
                include: { employees: true }
            });

            const realEmployeeId = biographyRecord.employees?.id;
            if (!realEmployeeId) throw new Error("Failed to create the employee relation.");

            // REMOVED: The tx.positions.findMany query and mapping

            const positionInserts = (data.positions || [])
                .map((p: any) => {
                    if (!p.position) return null; // Safety check
                    return {
                        employees_id: realEmployeeId,
                        positions: p.position, // UPDATED: Insert the string directly!
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

        revalidatePath("/hris/employees");

        return {
            success: true,
            id: result.id,
            username: result.username,
            email: result.email,
            tempPassword: rawPassword
        };

    } catch (error) {
        console.error("Create Employee Error:", error);
        return { error: "Failed to create employee account. Please check your inputs and try again." };
    }
}