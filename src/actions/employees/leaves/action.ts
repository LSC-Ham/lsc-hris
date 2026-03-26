// src\app\hris\(protected)\(user)\leave\file\actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface LeaveEntry {
    date: string;
    time_from: string;
    time_to: string;
    leave_type: string;
    reason: string;
}

export async function submitLeaveApplication(formData: FormData) {
    const employeeId = formData.get("employeeId") as string;
    const leavesDataString = formData.get("leavesData") as string;

    if (!employeeId || !leavesDataString) {
        return { error: "Missing required data. Please try again." };
    }

    const employee = await prisma.employees.findUnique({
        where: {
            id: employeeId
        },
        select: {
            id_number: true
        }
    });

    const idNumber = employee?.id_number;

    try {
        const leavesArray: LeaveEntry[] = JSON.parse(leavesDataString);

        if (leavesArray.length === 0) {
            return { error: "Please add at least one leave day." };
        }

        const leavesToInsert = leavesArray.map((leave) => {
            const timeFromDate = new Date(`${leave.date}T${leave.time_from}:00`);
            const timeToDate = new Date(`${leave.date}T${leave.time_to}:00`);

            const mainDate = new Date(leave.date);

            return {
                employees_id: employeeId,
                leave_type: leave.leave_type,
                date: mainDate,
                time_from: timeFromDate,
                time_to: timeToDate,
                reason: leave.reason || null,
            };
        });

        await prisma.employees_leaves.createMany({
            data: leavesToInsert,
        });

    } catch (error) {
        console.error("Database Error:", error);
        return { error: "Failed to submit leave application. Please try again." };
    }

    revalidatePath(`/hris/leave/${idNumber}`);
    redirect(`/hris/leave/${idNumber}`);
}


export async function updateDepartmentLeaveStatus(leaveId: string, newStatus: number) {
    try {

        const updatedLeave = await prisma.employees_leaves.update({
            where: {
                id: leaveId
            },
            data: {
                status: newStatus
            }
        });

        revalidatePath(`/hris/leave/request/`);
        revalidatePath("/hris/leave/request");

        return { success: true, data: updatedLeave };
    } catch (error) {
        console.error("Error updating leave status:", error);
        return { success: false, error: "Failed to update the leave status." };
    }
}