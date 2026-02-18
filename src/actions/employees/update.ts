// src\actions\employees\update.ts
"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updatePersonalInformation(data: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/login");
        }

        const userId = (session.user as any).id;

        // Ensure date is properly formatted for Prisma
        const formattedBirthdate = data.birthdate ? new Date(data.birthdate) : null;

        await prisma.employees.update({
            where: { id: userId },
            data: {
                personal_information: {
                    upsert: {
                        update: {
                            surname: data.surname,
                            firstname: data.firstname,
                            middlename: data.middlename,
                            extension: data.extension,
                            birthdate: formattedBirthdate,
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
                        },
                        create: {
                            surname: data.surname || "",
                            firstname: data.firstname || "",
                            middlename: data.middlename || "",
                            extension: data.extension || "",
                            birthdate: formattedBirthdate,
                            birthplace: data.birthplace || "",
                            sex: data.sex || "",
                            civil_status: data.civil_status || "",
                            telephone_no: data.telephone_no || "",
                            mobile_no: data.mobile_no || "",
                            email: data.email || "",
                            nationality: data.nationality || "",
                            height: data.height || "",
                            weight: data.weight || "",
                            blood_type: data.blood_type || "",
                        },
                    },
                },
            },
        });

        // Refreshes the current route to show the newly updated data immediately
        revalidatePath("/profile");

        return { success: true };

    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: "Failed to update personal information" };
    }
}