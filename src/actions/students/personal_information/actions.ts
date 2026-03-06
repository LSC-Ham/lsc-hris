"use server";

import { prisma } from "@/lib/prisma"; // Adjust this import to your actual Prisma client location
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getPersonalInformation(studentId: string) {
    try {
        // 2. Keep the session check! This ensures anonymous visitors 
        // can't just type in a URL and steal employee data.
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/login");
        }

        // 3. Search database using the employeeId from the URL, NOT the session ID
        const student = await prisma.students.findUnique({
            where: { id: studentId }, // 👈 This is the magic change
            include: {
                biography: {
                    select: {
                        personal_information: true,
                    }
                }
            },
        });

        if (!student) return null;

        return {
            id: student.id,
            ...(student.biography?.personal_information || {}),
        };

    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function updatePersonalInformation(data: any) {
    try {
        const { id, ...updateData } = data;

        // --- THE FIX: Format the birthdate ---
        // If there's a date, convert it to a true Date object. If it's "", make it null or undefined.
        // (Note: use `undefined` instead of `null` if your Prisma schema marks birthdate as required).
        const validBirthdate = updateData.birthdate
            ? new Date(updateData.birthdate).toISOString()
            : null;

        await prisma.biography.update({
            where: {
                id: data.biography_id
            },
            data: {
                personal_information: {
                    upsert: {
                        create: {
                            surname: updateData.surname,
                            firstname: updateData.firstname,
                            middlename: updateData.middlename,
                            extension: updateData.extension,
                            birthdate: validBirthdate, // <-- Pass the formatted date here
                            birthplace: updateData.birthplace,
                            sex: updateData.sex,
                            civil_status: updateData.civil_status,
                            telephone_no: updateData.telephone_no,
                            mobile_no: updateData.mobile_no,
                            email: updateData.email,
                            nationality: updateData.nationality,
                            height: updateData.height,
                            weight: updateData.weight,
                            blood_type: updateData.blood_type,
                        },
                        update: {
                            surname: updateData.surname,
                            firstname: updateData.firstname,
                            middlename: updateData.middlename,
                            extension: updateData.extension,
                            birthdate: validBirthdate, // <-- And pass it here
                            birthplace: updateData.birthplace,
                            sex: updateData.sex,
                            civil_status: updateData.civil_status,
                            telephone_no: updateData.telephone_no,
                            mobile_no: updateData.mobile_no,
                            email: updateData.email,
                            nationality: updateData.nationality,
                            height: updateData.height,
                            weight: updateData.weight,
                            blood_type: updateData.blood_type,
                        }
                    }
                },
            }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        console.error("Error updating personal information:", error);
        return { success: false, error: "Failed to save changes to the database." };
    }
}