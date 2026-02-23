//src\actions\admin\settings\departments\get.ts
"use server";

import { prisma } from "@/lib/prisma"; // Adjust your prisma import path

export async function getDepartments() {
    try {
        const departmentsData = await prisma.departments.findMany({
            select: { department: true }, // We only need the name for the dropdown
            orderBy: { department: 'asc' },
        });

        // Transform the array of objects into a simple array of strings
        // Result: ["Academics", "Finance", "HR", "IT"]
        const departments = departmentsData.map((d) => d.department);

        return departments;
    } catch (error) {
        console.error("Failed to fetch departments:", error);
        return []; // Return an empty array as a fallback so your UI doesn't break
    }
}
import { revalidatePath } from "next/cache";

// CREATE
export async function addDepartmentAction(formData: FormData) {
    const department = formData.get("department") as string;
    const description = formData.get("description") as string;

    await prisma.departments.create({
        data: { department, description },
    });

    revalidatePath("/hris/settings"); // Adjust this path to match your settings page URL
}

// UPDATE
export async function updateDepartmentAction(id: string, formData: FormData) {
    const department = formData.get("department") as string;
    const description = formData.get("description") as string;

    await prisma.departments.update({
        where: { id },
        data: { department, description },
    });

    revalidatePath("/hris/settings");
}

// DELETE
export async function deleteDepartmentAction(id: string) {
    await prisma.departments.delete({
        where: { id },
    });

    revalidatePath("/hris/settings");
}

