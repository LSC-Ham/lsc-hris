"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getPersonalInformation(employeeId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/login");
        }

        const employee = await prisma.employees.findUnique({
            where: { id: employeeId },
            include: {
                biography: {
                    select: {
                        personal_information: true,
                    }
                }
            },
        });

        if (!employee) return null;

        return {
            id: employee.id,
            ...(employee.biography?.personal_information || {}),
        };

    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function updatePersonalInformation(data: any) {
    try {
        const { id, ...updateData } = data;

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
                            birthdate: validBirthdate,
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
                            birthdate: validBirthdate,
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

        revalidatePath(`/hris/${data.id_number}`);
        revalidatePath(`/employees/${data.id_number}`);
        return { success: true };

    } catch (error) {
        console.error("Error updating personal information:", error);
        return { success: false, error: "Failed to save changes to the database." };
    }
}