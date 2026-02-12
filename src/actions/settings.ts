//src\actions\settings.ts

"use server";
import { prisma } from "@/lib/prisma"; // Adjust your prisma import path

export async function getSystemData() {
    const [divisions, departments, positions] = await Promise.all([
        // Fetch Divisions sorted alphabetically
        prisma.divisions.findMany({
            select: { id: true, division: true },
            orderBy: { division: 'asc' }
        }),
        // Fetch Departments sorted alphabetically
        prisma.departments.findMany({
            select: { id: true, department: true },
            orderBy: { department: 'asc' }
        }),
        prisma.positions.findMany({
            select: { id: true, position: true },
            orderBy: { position: 'asc' }
        })
    ]);

    return { divisions, departments, positions };
}