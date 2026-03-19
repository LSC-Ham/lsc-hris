"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getEducationalBackground(employeeId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const educationRecords = await prisma.educational_background.findMany({
            where: {
                biography: {
                    employees: {
                        id: employeeId
                    }
                }
            },
            orderBy: {
                date_from: 'desc'
            }
        });

        const formattedEducation = educationRecords.map((edu: any) => ({
            id: edu.id,
            level: edu.level || "",
            school: edu.school || "",
            degree: edu.degree || "",
            date_from: edu.date_from ? edu.date_from.toISOString().split('T')[0] : "",
            date_to: edu.date_to ? edu.date_to.toISOString().split('T')[0] : "",
            units_earned: edu.units_earned || "",
            year_graduated: edu.year_graduated || "",
        }));

        return formattedEducation;

    } catch (error) {
        console.error("Error fetching educational background:", error);
        return [];
    }
}

export async function updateEducationalBackground(data: any) {
    try {
        const employee = await prisma.employees.findFirst({
            where: { id_number: data.id_number },
            select: {
                biography: {
                    select: { users_id: true }
                }
            }
        });

        if (!employee || !employee.biography?.users_id) {
            return { success: false, error: "Employee record not found." };
        }

        await prisma.biography.update({
            where: { users_id: employee.biography.users_id },
            data: {
                educational_background: {
                    deleteMany: {},

                    create: data.records.map((record: any) => ({
                        level: record.level || null,
                        school: record.school || null,
                        degree: record.degree || null,
                        date_from: record.date_from ? new Date(record.date_from) : null,
                        date_to: record.date_to ? new Date(record.date_to) : null,
                        units_earned: record.units_earned || null,
                        year_graduated: record.year_graduated || null,
                    }))
                }
            }
        });

        revalidatePath(`/hris/${data.id_number}`);
        revalidatePath(`/employees/${data.id_number}`);
        return { success: true };

    } catch (error) {
        console.error("Error updating educational background:", error);
        return { success: false, error: "Failed to save changes to the database." };
    }
}