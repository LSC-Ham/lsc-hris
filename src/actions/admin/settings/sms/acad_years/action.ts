// 
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * FETCH: Full objects for the management table.
 */
export async function getAcadYears() {
    try {
        return await prisma.acad_years.findMany({
            select: {
                id: true,
                acad_year: true,
                order: true,
            },
            orderBy: { order: 'asc' },
        });
    } catch (error) {
        console.error("Failed to fetch academic years:", error);
        return [];
    }
}
