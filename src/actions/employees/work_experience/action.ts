"use server"

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma"; // Adjust path if needed

export async function getWorkExperience(employeeId: string) {
    try {

        // Query the work_experience table directly
        const workRecords = await prisma.work_experience.findMany({
            where: {
                biography: {
                    employees: {
                        id: employeeId
                    }
                }
            },
            orderBy: {
                date_from: 'desc' // ISO standard: show most recent experience first
            }
        });

        // Map and format for frontend state
        const formattedWorkExperience = workRecords.map((work: any) => ({
            id: work.id,
            position_title: work.position_title || "",
            company: work.company || "",
            // Convert Decimal to Number for frontend state
            monthly_salary: work.monthly_salary ? Number(work.monthly_salary) : 0,
            appointment_status: work.appointment_status || "",
            gov_service: work.gov_service || false,
            // Format DateTime to "YYYY-MM-DD" for <input type="date" />
            date_from: work.date_from ? work.date_from.toISOString().split('T')[0] : "",
            date_to: work.date_to ? work.date_to.toISOString().split('T')[0] : "",
        }));

        return formattedWorkExperience;

    } catch (error) {
        console.error("Error fetching work experience:", error);
        return []; // Return empty array to prevent frontend .map() crashes
    }
}

export async function updateWorkExperience(data: any) {
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
            where: {
                users_id: employee.biography.users_id
            },
            data: {
                work_experience: {
                    // 1. Wipe existing records to sync with the new list
                    deleteMany: {},

                    // 2. Create the new records
                    create: data.records.map((record: any) => ({
                        date_from: record.date_from ? new Date(record.date_from) : null,
                        date_to: record.date_to ? new Date(record.date_to) : null,
                        position_title: record.position_title || null,
                        company: record.company || null,

                        // Convert string/number to Prisma Decimal
                        monthly_salary: record.monthly_salary != null && record.monthly_salary !== ""
                            ? parseFloat(record.monthly_salary)
                            : null,

                        appointment_status: record.appointment_status || null,
                        gov_service: Boolean(record.gov_service),
                    }))
                }
            }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        console.error("Error updating work experience:", error);
        return { success: false, error: "Failed to save work experience." };
    }
}