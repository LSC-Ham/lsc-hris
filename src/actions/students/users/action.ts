"use server";

import { prisma } from "@/lib/prisma"; // Adjust this import to your actual Prisma client location
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt"; // Requires: npm install bcryptjs\

export async function createStudent(data: any) {
    try {

        // 4. Hash the default password BEFORE starting the transaction
        const hashedPassword = await bcrypt.hash("lakeshore123", 10);

        // 5. Execute Database Transaction
        const newStudentId = await prisma.$transaction(async (tx) => {

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
                    students: {
                        create: {
                            id_number: data.id_number,
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
                    students: true
                }
            });

            // add the students details here
        });

        // 6. Revalidate cache so the new employee shows up immediately in lists
        revalidatePath("/students");

        return { success: true, id: newStudentId };

    } catch (error) {
        console.error("Create Employee Error:", error);
        return { error: "Failed to create employee account. Please check your inputs and try again." };
    }
}