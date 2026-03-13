// src/actions/admin/settings/positions/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPositions() {
    try {
        return await prisma.positions.findMany({
            select: {
                id: true,
                position: true,
                departments_id: true, 
                description: true
            },
            orderBy: { position: 'asc' },
        });
    } catch (error) {
        console.error("Failed to fetch positions:", error);
        return [];
    }
}

export async function addPosition(formData: FormData) {
    const position = formData.get("position") as string;
    const department = formData.get("department") as string; 
    const description = formData.get("description") as string;

    await prisma.positions.create({
        data: { position, departments_id: department, description },
    });

    revalidatePath("/hris/settings");
}

export async function updatePosition(id: string, formData: FormData) {
    const position = formData.get("position") as string;
    const department = formData.get("department") as string; 
    const description = formData.get("description") as string;

    await prisma.positions.update({
        where: { id },
        data: { position, departments_id: department, description },
    });

    revalidatePath("/hris/settings");
}

export async function deletePosition(id: string) {
    await prisma.positions.delete({
        where: { id },
    });

    revalidatePath("/hris/settings");
}

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