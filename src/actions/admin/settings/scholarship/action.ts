// 
"use server";

import { prisma } from "@/lib/prisma";

export async function getScholarships() {
    try {
        const scholarshipsData = await prisma.scholarships.findMany({
            select: {
                id: true,
                scholarship: true,
                amount: true,
                description: true
            },
            orderBy: { scholarship: 'asc' },
        });

        return scholarshipsData;

    } catch (error) {
        console.error("Failed to fetch scholarships:", error);
        return [];
    }
}

