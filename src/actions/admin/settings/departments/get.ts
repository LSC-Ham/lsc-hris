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