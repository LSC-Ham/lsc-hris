// 
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSections() {
    try {
        const sectionsData = await prisma.sections.findMany({
            select: {
                id: true,
                acad_level_id: true,
                section: true,
                description: true,
                year_id: true,
            },
            orderBy: { acad_level_id: 'asc' },
        });

        return sectionsData;

    } catch (error) {
        console.error("Failed to fetch sections:", error);
        return [];
    }
}

