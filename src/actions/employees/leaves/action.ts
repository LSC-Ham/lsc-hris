// src\app\hris\(protected)\(user)\leave\file\actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitLeaveApplication(formData: FormData) {
    const employeeId = formData.get("employeeId") as string;
    const leaveType = formData.get("leaveType") as string;
    const dateFrom = formData.get("dateFrom") as string;
    const dateTo = formData.get("dateTo") as string;
    const reason = formData.get("reason") as string;

    if (!employeeId || !leaveType || !dateFrom || !dateTo) {
        return { error: "Please fill out all required fields." };
    }

    try {
        await prisma.employees_leaves.create({
            data: {
                employees_id: employeeId,
                leave_type: leaveType,
                date_from: new Date(dateFrom),
                date_to: new Date(dateTo),
                reason: reason || null,
                status: 1,
            }
        });

    } catch (error) {
        console.error("Database Error:", error);
        return { error: "Failed to submit leave application. Please try again." };
    }

    revalidatePath("/hris/leave");

    redirect("/hris/leave");
}