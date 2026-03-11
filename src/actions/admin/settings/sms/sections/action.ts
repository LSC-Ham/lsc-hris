// 
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * FETCH: Full objects for the management table.
 */
export async function getSections() {
    try {
        const sectionsData = await prisma.sections.findMany({
            // We select id, department, and description so the table has all the info
            select: {
                id: true,
                acad_level_id: true,
                section: true,
                description: true
            },
            orderBy: { acad_level_id: 'asc' },
        });

        // ✅ Return the full array of objects
        return sectionsData;

    } catch (error) {
        console.error("Failed to fetch sections:", error);
        return [];
    }
}

