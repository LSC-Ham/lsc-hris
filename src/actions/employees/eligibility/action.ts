"use server";

import { prisma } from "@/lib/prisma"; // Adjust path if needed
import { authOptions } from "@/lib/auth"; // Adjust path if needed
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getEligibility(employeeId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        // Directly query the "Many" table using the employee's ID
        const eligibilityRecords = await prisma.eligibility.findMany({
            where: {
                biography: {
                    employees: {
                        id: employeeId
                    }
                }
            },
        });

        // Map the array of records to safely format the dates and nulls for your frontend state
        const formattedEligibility = eligibilityRecords.map((eli: any) => ({
            id: eli.id,
            qualification: eli.qualification || "",
            rating: eli.rating || "",
            // Format DateTime to "YYYY-MM-DD" string for your <input type="date" />
            date_examination: eli.date_examination ? eli.date_examination.toISOString().split('T')[0] : "",
            place_examination: eli.place_examination || "",
            id_number: eli.id_number || "",
            date_validity: eli.date_validity || "",
        }));

        return formattedEligibility; // Returns an array []

    } catch (error) {
        console.error("Error fetching educational background:", error);
        return []; // Always return an array so your frontend .map() doesn't break
    }
}

export async function updateEligibility(data: any) {
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
                // Nested write for the eligibility relation
                eligibility: {
                    // 1. Wipe existing eligibility records for this employee
                    deleteMany: {},

                    // 2. Create the new records from the array
                    create: data.records.map((record: any) => ({
                        qualification: record.qualification || null,
                        rating: record.rating || null,
                        // Schema uses String? for these, so we pass them directly
                        date_examination: record.date_examination && record.date_examination.trim() !== ""
                            ? new Date(record.date_examination)
                            : null,
                        place_examination: record.place_examination || null,
                        id_number: record.id_number || null,
                        date_validity: record.date_validity || null,
                    }))
                }
            }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        console.error("Error updating eligibility:", error);
        return { success: false, error: "Failed to save eligibility records to the database." };
    }
}