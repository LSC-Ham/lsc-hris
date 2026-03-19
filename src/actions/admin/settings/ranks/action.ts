// src/actions/admin/settings/divisions/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getRanks() {
    try {
        return await prisma.ranks.findMany({
            select: {
                id: true,
                rank: true,
                description: true,
                order: true,
            },
            orderBy: { order: 'desc' },
        });
    } catch (error) {
        console.error("Failed to fetch ranks:", error);
        return [];
    }
}

export async function addRank(formData: FormData) {
    const rank = formData.get("rank") as string;
    const description = formData.get("description") as string;
    const rawOrder = formData.get("order");
    const order = parseInt(String(rawOrder), 10);

    await prisma.ranks.create({
        data: { rank, description, order },
    });

    revalidatePath("/hris/settings");
}

export async function updateRank(id: string, formData: FormData) {
    const rank = formData.get("rank") as string;
    const description = formData.get("description") as string;
    const rawOrder = formData.get("order");
    const order = parseInt(String(rawOrder), 10);

    await prisma.ranks.update({
        where: { id },
        data: { rank, description, order },
    });

    revalidatePath("/hris/settings");
}

export async function deleteRank(id: string) {
    await prisma.ranks.delete({
        where: { id },
    });

    revalidatePath("/hris/settings");
}