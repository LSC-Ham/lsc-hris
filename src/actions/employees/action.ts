"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteEmployee(employeeId: string) {
    try {
        await prisma.employees.delete({
            where: { id_number: employeeId }
        });

        revalidatePath("/hris/employees");
        return { success: true };

    } catch (error) {
        console.error("Delete Biography Error:", error);
        return { error: "Failed to delete employee profile." };
    }
}