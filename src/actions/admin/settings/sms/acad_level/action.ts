// 
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAcadLevel() {
    try {
        const acadLevelData = await prisma.acad_level.findMany({
            select: {
                id: true,
                acad_level_code: true,
                acad_level_name: true, 
                order: true,
                description: true
            },
            orderBy: { order: 'asc' },
        });

        return acadLevelData;

    } catch (error) {
        console.error("Failed to fetch academic levels:", error);
        return [];
    }
}

