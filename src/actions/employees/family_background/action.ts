"use server";

import { prisma } from "@/lib/prisma"; // Adjust path if needed
import { authOptions } from "@/lib/auth"; // Adjust path if needed
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getFamilyBackground(employeeId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const employee = await prisma.employees.findUnique({
            where: { id: employeeId },
            include: {
                biography: {
                    select: {
                        family_background: true,
                    }
                }
            },
        });

        if (!employee) return null;

        const formattedFam_bg = employee.biography?.family_background.map((record) => ({
            id: record.id,
            relation_type: record.relation_type,
            surname: record.surname,
            firstname: record.firstname,
            middlename: record.middlename,
            extension: record.extension,
            occupation: record.occupation,
            employer: record.employer,
            occupation_address: record.occupation_address,
            contact_no: record.contact_no,

        }));
        return {
            id: employee.id,
            family_background: formattedFam_bg,
        };

    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function updateFamilyBackground(data: any) {
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
                family_background: {
                    deleteMany: {
                        relation_type: { in: ["guardian", "father", "mother"] }
                    },
                    create: [
                        { relation_type: "guardian", ...data.guardian },
                        { relation_type: "father", ...data.father },
                        { relation_type: "mother", ...data.mother }
                    ]
                }
            }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        console.error("Error updating family information:", error);
        return { success: false, error: "Failed to save changes to the database." };
    }
}