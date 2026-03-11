// 
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * FETCH: Full objects for the management table.
 */
export async function getYears() {
    try {
        const yearsData = await prisma.years.findMany({
            // We select id, department, and description so the table has all the info
            select: {
                id: true,
                year: true,
                order: true,
                description: true,
                acad_level_id: true,
            },
            orderBy: { order: 'asc' },
        });

        // ✅ Return the full array of objects
        return yearsData;

    } catch (error) {
        console.error("Failed to fetch years:", error);
        return [];
    }
}

