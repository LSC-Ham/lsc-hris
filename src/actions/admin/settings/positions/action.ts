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
                departments_id: true, // <-- ADDED: So the frontend can pre-fill the dropdowns
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
    const department = formData.get("department") as string; // <-- ADDED: Get the selected department ID
    const description = formData.get("description") as string;

    await prisma.positions.create({
        // ADDED: Pass the department ID to your database column (departments_id)
        data: { position, departments_id: department, description },
    });

    revalidatePath("/hris/settings");
}

// UPDATE
export async function updatePosition(id: string, formData: FormData) {
    const position = formData.get("position") as string;
    const department = formData.get("department") as string; // <-- ADDED: Get the selected department ID
    const description = formData.get("description") as string;

    await prisma.positions.update({
        where: { id },
        // ADDED: Update the department ID in your database column
        data: { position, departments_id: department, description },
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

// GET EXISTING STATUSES
export async function getExistingStatuses() {
    try {
        return await prisma.employees_positions.findMany({
            select: { status: true },
            distinct: ['status'],
            where: { NOT: { status: null } }
        });
    } catch (error) {
        console.error("Error fetching statuses:", error);
        return [];
    }
}