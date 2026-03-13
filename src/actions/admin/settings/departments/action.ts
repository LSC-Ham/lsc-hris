//src\actions\admin\settings\departments\get.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDepartments() {
    try {
        const departmentsData = await prisma.departments.findMany({
            select: {
                id: true,
                department: true,
                description: true
            },
            orderBy: { department: 'asc' },
        });

        return departmentsData;

    } catch (error) {
        console.error("Failed to fetch departments:", error);
        return [];
    }
}

export async function addDepartment(formData: FormData) {
    const department = formData.get("department") as string;
    const description = formData.get("description") as string;

    await prisma.departments.create({
        data: { department, description },
    });

    revalidatePath("/hris/settings"); 
}

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

