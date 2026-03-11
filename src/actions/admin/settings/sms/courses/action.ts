// 
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * FETCH: Full objects for the management table.
 */
export async function getCourses() {
    try {
        return await prisma.courses.findMany({
            select: {
                id: true,
                department_id: true,
                course_code: true,
                course_name: true,
                created_by: true,
            },
            orderBy: { created_at: 'asc' },
        });
    } catch (error) {
        console.error("Failed to fetch academic years:", error);
        return [];
    }
}
