// 
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSemesters() {
    try {
        return await prisma.semesters.findMany({
            select: {
                id: true,
                semester: true,
                order: true,
            },
            orderBy: { order: 'asc' },
        });
    } catch (error) {
        console.error("Failed to fetch academic years:", error);
        return [];
    }
}
