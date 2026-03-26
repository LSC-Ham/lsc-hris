// src\app\hris\(protected)\(user)\leave\file\actions.ts

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

export async function deleteLeaveRequest(leaveId: string) {
    try {
        const deletedLeave = await prisma.employees_leaves.delete({
            where: {
                id: leaveId
            }
        });

        // Match your existing cache revalidation paths
        revalidatePath(`/hris/leave/request/`);
        revalidatePath("/hris/leave/request");

        return { success: true, data: deletedLeave };
    } catch (error) {
        console.error("Error deleting leave request:", error);
        return { success: false, error: "Failed to delete the leave request." };
    }
}

export async function resetEmployeeLeaves() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const userId = (session.user as any).id;

        // 1. Get the Full Name of the person performing the reset
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                biography: {
                    select: {
                        personal_information: {
                            select: { firstname: true, surname: true }
                        }
                    }
                }
            }
        });

        const info = currentUser?.biography?.personal_information;
        const fullName = info ? `${info.firstname} ${info.surname}` : "Unknown Admin";

        await prisma.leave_reset_logs.create({
            data: {
                date: new Date(),
                reset_by: fullName,
            }
        });

        revalidatePath("/hris/leaves/management");
        return { success: true };
    } catch (error) {
        console.error("Reset Error:", error);
        return { success: false, error: "Failed to reset leaves." };
    }
}