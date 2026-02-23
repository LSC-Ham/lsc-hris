// src/actions/admin/settings/divisions/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * FETCH: Returns full objects for the Settings Table
 * To get only names for dropdowns, use: 
 * const data = await getDivisions();
 * const names = data.map(d => d.division);
 */
export async function getDivisions() {
    try {
        return await prisma.divisions.findMany({
            select: {
                id: true,
                division: true,
                description: true
            },
            orderBy: { division: 'asc' },
        });
    } catch (error) {
        console.error("Failed to fetch divisions:", error);
        return [];
    }
}

// CREATE
export async function addDivision(formData: FormData) {
    const division = formData.get("division") as string;
    const description = formData.get("description") as string;

    await prisma.divisions.create({
        data: { division, description },
    });

    revalidatePath("/hris/settings");
}

// UPDATE
export async function updateDivision(id: string, formData: FormData) {
    const division = formData.get("division") as string;
    const description = formData.get("description") as string;

    await prisma.divisions.update({
        where: { id },
        data: { division, description },
    });

    revalidatePath("/hris/settings");
}

// DELETE
export async function deleteDivision(id: string) {
    await prisma.divisions.delete({
        where: { id },
    });

    revalidatePath("/hris/settings");
}