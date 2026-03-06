"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteEmployee(employeeId: string) {
    try {
        // Delete the biography directly. 
        // Your database cascade will automatically wipe all the nested tables 
        // (address, family, work_experience, etc.) while leaving the User account alone.
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