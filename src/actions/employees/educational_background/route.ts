"use server";

import { prisma } from "@/lib/prisma"; // Adjust path if needed
import { authOptions } from "@/lib/auth"; // Adjust path if needed
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getEducationalBackground(employeeId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        // Directly query the "Many" table using the employee's ID
        const educationRecords = await prisma.educational_background.findMany({
            where: {
                employees: {
                    id: employeeId
                }
            },
            orderBy: {
                date_from: 'desc' // Optional: Brings their most recent education to the top
            }
        });

        // Map the array of records to safely format the dates and nulls for your frontend state
        const formattedEducation = educationRecords.map((edu: any) => ({
            id: edu.id,
            level: edu.level || "",
            school: edu.school || "",
            degree: edu.degree || "",
            // Format DateTime to "YYYY-MM-DD" string for your <input type="date" />
            date_from: edu.date_from ? edu.date_from.toISOString().split('T')[0] : "",
            date_to: edu.date_to ? edu.date_to.toISOString().split('T')[0] : "",
            units_earned: edu.units_earned || "",
            year_graduated: edu.year_graduated || "",
        }));

        return formattedEducation; // Returns an array []

    } catch (error) {
        console.error("Error fetching educational background:", error);
        return []; // Always return an array so your frontend .map() doesn't break
    }
}

export async function updateEducationalBackground(data: any[]) { // Expecting an array of records
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return { success: false, error: "Unauthorized. Please log in." };
        }

        const userId = (session.user as any).id;

        await prisma.employees.update({
            where: {
                users_id: userId
            },
            data: {
                // This is the magic nested write block
                educational_background: {
                    // 1. Clear out the old records associated with this employee
                    deleteMany: {},

                    // 2. Insert the updated array of records
                    create: data.map((record: any) => ({
                        level: record.level || null,
                        school: record.school || null,
                        degree: record.degree || null,
                        // Convert frontend string dates ("YYYY-MM-DD") to JS Date objects for PostgreSQL DateTime
                        date_from: record.date_from ? new Date(record.date_from) : null,
                        date_to: record.date_to ? new Date(record.date_to) : null,
                        units_earned: record.units_earned || null,
                        year_graduated: record.year_graduated || null,
                    }))
                }
            }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        console.error("Error updating educational background:", error);
        return { success: false, error: "Failed to save changes to the database." };
    }
}