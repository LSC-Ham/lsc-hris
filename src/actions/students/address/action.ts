"use server";

import { prisma } from "@/lib/prisma"; 
import { authOptions } from "@/lib/auth"; 
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getAddress(studentId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const student = await prisma.students.findUnique({
            where: { id: studentId },
            include: {
                biography: {
                    select: {
                        address: true,
                    }
                }
            },
        });

        if (!student) return null;

        const formattedAddress = student.biography?.address.map((record) => ({
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
            id: student.id,
            address: formattedAddress,
        };

    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function updateAddress(data: any) {
    try {
        const student = await prisma.students.findFirst({
            where: { id_number: data.id_number },
            select: {
                biography: {
                    select: { users_id: true }
                }
            }
        });

        if (!student || !student.biography?.users_id) {
            return { success: false, error: "Student record not found." };
        }

        await prisma.biography.update({
            where: { users_id: student?.biography.users_id },
            data: {
                address: {
                    deleteMany: {
                        address_type: { in: ["residential", "permanent"] }
                    },
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