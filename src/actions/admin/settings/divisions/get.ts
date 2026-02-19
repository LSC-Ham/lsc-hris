"use server";

import { prisma } from "@/lib/prisma"; // Adjust your prisma import path

export async function getDivisions() {
    try {
        const divisionsData = await prisma.divisions.findMany({
            select: { division: true }, // We only need the name for the dropdown
            orderBy: { division: 'asc' },
        });

        // Transform the array of objects into a simple array of strings
        // Result: ["Academics", "Finance", "HR", "IT"]
        const divisions = divisionsData.map((d) => d.division);

        return divisions;
    } catch (error) {
        console.error("Failed to fetch divisions:", error);
        return []; // Return an empty array as a fallback so your UI doesn't break
    }
}