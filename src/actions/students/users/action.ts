"use server";

import { prisma } from "@/lib/prisma"; // Adjust this import to your actual Prisma client location
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export async function createStudent(data: any) {
    try {
        const hashedPassword = await bcrypt.hash("lakeshore123", 10);

        const newStudentId = await prisma.$transaction(async (tx) => {

            // 1. Create the base User account
            const newUser = await tx.user.create({
                data: {
                    password: hashedPassword,
                    password_changed: false,
                }
            });

            // 2. Create Biography, Personal Info, and the Student record all at once
            const biographyRecord = await tx.biography.create({
                data: {
                    users_id: newUser.id,
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
                    },
                    // Create the student profile directly attached to this biography
                    students: {
                        create: {
                            id_number: data.id_number,
                            // Map your form data to the specific schema foreign keys
                            acad_year_id: data.acad_year || null,
                            semester_id: data.semester || null,
                            acad_level_id: data.acad_level || null,
                            course_id: data.course || null,
                            year_level_id: data.year || null,
                            sections_id: data.section || null,
                            scholarship_id: data.scholarship || null,
                        }
                    }
                },
                include: {
                    students: true
                }
            });

            // biographyRecord.students is an array because the schema is `students[]`
            const createdStudentId = biographyRecord.students[0]?.id;

            if (!createdStudentId) {
                throw new Error("Failed to retrieve generated Student ID");
            }

            return createdStudentId;
        });

        // Revalidate the cache so the new student shows up immediately
        revalidatePath("/sms/admission/students"); // Adjust to your actual path

        return { success: true, id: newStudentId };

    } catch (error) {
        console.error("Create Student Error:", error);
        return { error: "Failed to create student account. Please check your inputs and try again." };
    }
}