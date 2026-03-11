// 
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * FETCH: Full objects for the management table.
 */
export async function getScholarships() {
    try {
        const scholarshipsData = await prisma.scholarships.findMany({
            // We select id, department, and description so the table has all the info
            select: {
                id: true,
                scholarship: true,
                amount: true,
                description: true
            },
            orderBy: { scholarship: 'asc' },
        });

        // ✅ Return the full array of objects
        return scholarshipsData;

    } catch (error) {
        console.error("Failed to fetch scholarships:", error);
        return [];
    }
}

