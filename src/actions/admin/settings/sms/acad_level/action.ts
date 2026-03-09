// 
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * FETCH: Full objects for the management table.
 */
export async function getAcadLevel() {
    try {
        const acadLevelData = await prisma.acad_level.findMany({
            // We select id, department, and description so the table has all the info
            select: {
                id: true,
                acad_level_code: true,
                acad_level_name: true, 
                order: true,
                description: true
            },
            orderBy: { order: 'asc' },
        });

        // ✅ Return the full array of objects
        return acadLevelData;

    } catch (error) {
        console.error("Failed to fetch academic levels:", error);
        return [];
    }
}

