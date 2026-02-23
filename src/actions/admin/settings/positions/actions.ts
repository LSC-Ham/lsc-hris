// src/actions/admin/settings/positions/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * FETCH: Full objects for the management table.
 */
export async function getPositions() {
    try {
        return await prisma.positions.findMany({
            select: {
                id: true,
                position: true,
                description: true
            },
            orderBy: { position: 'asc' },
        });
    } catch (error) {
        console.error("Failed to fetch positions:", error);
        return [];
    }
}

// CREATE
export async function addPosition(formData: FormData) {
    const position = formData.get("position") as string;
    const description = formData.get("description") as string;

    await prisma.positions.create({
        data: { position, description },
    });

    revalidatePath("/hris/settings");
}

// UPDATE
export async function updatePosition(id: string, formData: FormData) {
    const position = formData.get("position") as string;
    const description = formData.get("description") as string;

    await prisma.positions.update({
        where: { id },
        data: { position, description },
    });

    revalidatePath("/hris/settings");
}

// DELETE
export async function deletePosition(id: string) {
    await prisma.positions.delete({
        where: { id },
    });

    revalidatePath("/hris/settings");
}

// src/actions/admin/settings/positions/actions.ts

export async function getExistingStatuses() {
    const statuses = await prisma.employees_positions.findMany({
        select: { status: true },
        distinct: ['status'],
        where: { NOT: { status: null } }
    });
    return statuses.map(s => s.status);
}