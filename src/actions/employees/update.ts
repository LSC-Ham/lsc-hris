"use server";

import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma"; // Adjust this import to your actual Prisma client location
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import { revalidatePath } from "next/cache";

export async function updatePersonalInformation(data: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return { success: false, error: "Unauthorized. Please log in." };
        }

        const userId = (session.user as any).id;
        const { id, ...updateData } = data;

        // --- THE FIX: Format the birthdate ---
        // If there's a date, convert it to a true Date object. If it's "", make it null or undefined.
        // (Note: use `undefined` instead of `null` if your Prisma schema marks birthdate as required).
        const validBirthdate = updateData.birthdate
            ? new Date(updateData.birthdate).toISOString()
            : null;

        await prisma.employees.update({
            where: {
                id: userId
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
                }
            }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        console.error("Error updating personal information:", error);
        return { success: false, error: "Failed to save changes to the database." };
    }
}