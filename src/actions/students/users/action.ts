"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function createStudent(data: any) {
    try {
        console.log("Raw Data received by createStudent:", data);

        if (!data.id_number || !data.firstname || !data.surname || !data.acad_level_id) {
            return { error: "Missing required fields. Please ensure ID, Name, and Academic Level are provided." };
        }

        const hashedPassword = await bcrypt.hash("lakeshore123", 10);

        const newStudentId = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    password: hashedPassword,
                    password_changed: false,
                }
            });

            const biographyRecord = await tx.biography.create({
                data: {
                    users_id: newUser.id,

                    students: {
                        create: {
                            id_number: data.id_number,
                            acad_level_id: data.acad_level_id || data.acad_level || null,
                            course_id: data.course_id || data.course || null,
                            acad_year_id: data.acad_year_id || data.acad_year || null,
                            semester_id: data.semester_id || data.semester || null,
                            year_id: data.year_level_id || data.year || null,
                            sections_id: data.sections_id || data.section_id || data.section || null,
                            scholarship_id: data.scholarship_id || data.scholarship || null,
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
                include: {
                    students: true
                }
            });

            const realStudentId = biographyRecord.students[0].id;

            if (!realStudentId) {
                throw new Error("Failed to create the student relation.");
            }

            return realStudentId;
        });

        revalidatePath("/students");
        revalidatePath("/sms/admission/students");

        return { success: true, id: newStudentId };

    } catch (error) {
        console.error("Create Student Error:", error);
        return { error: "Failed to create student account. Please check your inputs and try again." };
    }
}