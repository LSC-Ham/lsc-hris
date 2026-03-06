"use server";

import { prisma } from "@/lib/prisma"; // Adjust path if needed
import { authOptions } from "@/lib/auth"; // Adjust path if needed
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getAddress(employeeId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const employee = await prisma.employees.findUnique({
            where: { id: employeeId },
            include: {
                biography: {
                    select: {
                        address: true,
                    }
                }
            },
        });

        if (!employee) return null;

        const formattedAddress = employee.biography?.address.map((record) => ({
            id: record.id,
            address_type: record.address_type,
            region: record.region,
            province: record.province,
            city: record.city,
            barangay: record.barangay,
            house_no: record.house_no,
            street: record.street,
            subdivision: record.subdivision,
            zip_code: record.zip_code,
        }));
        return {
            id: employee.id,
            address: formattedAddress,
        };

    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function updateAddress(data: any) {
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
            where: { users_id: employee?.biography.users_id },
            data: {
                // Access the related address table
                address: {
                    // 1. Remove the old addresses of these specific types
                    deleteMany: {
                        address_type: { in: ["residential", "permanent"] }
                    },
                    // 2. Insert the newly updated ones
                    create: [
                        {
                            address_type: "residential",
                            region: data.residential.region,
                            province: data.residential.province,
                            city: data.residential.city,
                            barangay: data.residential.barangay,
                            house_no: data.residential.house_no,
                            street: data.residential.street,
                            subdivision: data.residential.subdivision,
                            zip_code: data.residential.zip_code,
                        },
                        {
                            address_type: "permanent",
                            region: data.permanent.region,
                            province: data.permanent.province,
                            city: data.permanent.city,
                            barangay: data.permanent.barangay,
                            house_no: data.permanent.house_no,
                            street: data.permanent.street,
                            subdivision: data.permanent.subdivision,
                            zip_code: data.permanent.zip_code,
                        }
                    ]
                }
            }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        console.error("Error updating address information:", error);
        return { success: false, error: "Failed to save changes to the database." };
    }
}