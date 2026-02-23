//src\actions\admin\settings\departments\get.ts
"use server";

import { prisma } from "@/lib/prisma"; // Adjust your prisma import path
import { revalidatePath } from "next/cache";

export async function getDepartments() {
    try {
        const departmentsData = await prisma.departments.findMany({
            // We select id, department, and description so the table has all the info
            select: {
                id: true,
                department: true,
                description: true
            },
            orderBy: { department: 'asc' },
        });

        // ✅ Return the full array of objects
        return departmentsData;

    } catch (error) {
        console.error("Failed to fetch departments:", error);
        return [];
    }
}

// CREATE
export async function addDepartment(formData: FormData) {
    const department = formData.get("department") as string;
    const description = formData.get("description") as string;

    await prisma.departments.create({
        data: { department, description },
    });

    revalidatePath("/hris/settings"); // Adjust this path to match your settings page URL
}

// UPDATE
export async function updateDepartment(id: string, formData: FormData) {
    const department = formData.get("department") as string;
    const description = formData.get("description") as string;

    await prisma.departments.update({
        where: { id },
        data: { department, description },
    });

    revalidatePath("/hris/settings");
}

// DELETE
export async function deleteDepartment(id: string) {
    await prisma.departments.delete({
        where: { id },
    });

    revalidatePath("/hris/settings");
}

