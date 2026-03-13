// 
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getYears() {
    try {
        const yearsData = await prisma.years.findMany({
            select: {
                id: true,
                year: true,
                order: true,
                description: true,
                acad_level_id: true,
            },
            orderBy: { order: 'asc' },
        });

        return yearsData;

    } catch (error) {
        console.error("Failed to fetch years:", error);
        return [];
    }
}

