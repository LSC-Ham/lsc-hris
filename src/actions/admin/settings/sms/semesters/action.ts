// 
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * FETCH: Full objects for the management table.
 */
export async function getSemesters() {
    try {
        return await prisma.semesters.findMany({
            select: {
                id: true,
                semester: true,
                order: true,
                is_active: true,
            },
            orderBy: { order: 'asc' },
        });
    } catch (error) {
        console.error("Failed to fetch academic years:", error);
        return [];
    }
}
