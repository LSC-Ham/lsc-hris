"use server";

import { prisma } from "@/lib/prisma"; // Adjust your prisma import path

export async function getPositions() {
    try {
        const positionsData = await prisma.positions.findMany({
            select: { position: true }, // We only need the name for the dropdown
            orderBy: { position: 'asc' },
        });

        // Transform the array of objects into a simple array of strings
        // Result: ["Academics", "Finance", "HR", "IT"]
        const positions = positionsData.map((d) => d.position);

        return positions;
    } catch (error) {
        console.error("Failed to fetch positions:", error);
        return []; // Return an empty array as a fallback so your UI doesn't break
    }
}