"use client";

import { updateDepartmentLeaveStatus } from "@/actions/employees/leaves/action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FiledLeavePage from "./FiledLeavePage";

interface LeaveData {
    id: string;
    leave_type: string;
    date: string;
    time_from: string;
    time_to: string;
    reason: string | null;
    status: number | null;
    created_at: string;
}

interface Props {
    leave: LeaveData;
    departmentRole?: string;
    headName?: string;
    vpName?: string;
    rank?: string;
    department?: string;
    employeeName?: string;
    departmentName?: string;
    hasDepartmentHead?: boolean;
    isRequestorHead?: boolean;
}

export default function RequestorFiledLeavePage({
    leave, departmentRole, headName, vpName, rank, department,
    employeeName, departmentName, hasDepartmentHead = true, isRequestorHead = false
}: Props) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split('T')[0];
    };

    const formatTimeForInput = (timeString: string) => {
        if (!timeString) return "";
        const dateObj = new Date(timeString);
        return dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    const formattedLeave = {
        ...leave,
        created_at: formatDateForInput(leave.created_at),
        date: formatDateForInput(leave.date),
        time_from: formatTimeForInput(leave.time_from),
        time_to: formatTimeForInput(leave.time_to),
    };

    const isHead = ["head", "assistant head"].includes(departmentRole?.toLowerCase() || "");
    const canApproveFinal = rank?.toLowerCase() === "vice president" || department?.toLowerCase() === "human resource";

    const handleStatusUpdate = async (newStatus: number) => {
        setIsUpdating(true);
        try {
            const response = await updateDepartmentLeaveStatus(leave.id, newStatus);
            if (!response.success) throw new Error(response.error);
            router.refresh();
        } catch (error) {
            console.error("Failed to update leave status:", error);
            alert(error instanceof Error ? error.message : "Something went wrong while updating the leave status.");
        } finally {
            setIsUpdating(false);
        }
    };

    const headActions = (isHead && leave.status === null && hasDepartmentHead !== false && !isRequestorHead) ? (
        <div className="flex gap-2">
            <button
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(1)}
                className="cursor-pointer flex-1 inline-flex justify-center items-center px-3 py-2 rounded-lg text-xs font-semibold text-white bg-brand border border-transparent shadow-sm transition-all duration-200 hover:bg-brand-dark hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand disabled:hover:-translate-y-0 disabled:hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 dark:focus:ring-offset-zinc-900"
            >
                Approve
            </button>

            <button
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(0)}
                className="cursor-pointer flex-1 inline-flex justify-center items-center px-3 py-2 rounded-lg text-xs font-semibold text-foreground bg-surface border border-divider shadow-sm transition-all duration-200 hover:bg-background hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:-translate-y-0 disabled:hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-divider focus:ring-offset-1 dark:focus:ring-offset-zinc-900"
            >
                Decline
            </button>
        </div>
    ) : undefined;

    const skipsHeadApproval = hasDepartmentHead === false || isRequestorHead;
    const canVpActNow = leave.status === 1 || (leave.status === null && skipsHeadApproval);

    const vpActions = (canApproveFinal && canVpActNow) ? (
        <div className="flex gap-2">
            <button
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(3)}
                className="cursor-pointer flex-1 inline-flex justify-center items-center px-3 py-2 rounded-lg text-xs font-semibold text-white bg-brand border border-transparent shadow-sm transition-all duration-200 hover:bg-brand-dark hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand disabled:hover:-translate-y-0 disabled:hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 dark:focus:ring-offset-zinc-900"
            >
                Approve
            </button>

            <button
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(2)}
                className="cursor-pointer
                        flex-1 inline-flex justify-center items-center px-3 py-2 rounded-lg 
                        text-xs font-semibold text-foreground 
                        bg-surface border border-divider shadow-sm 
                        transition-all duration-200 
                        /* The Fix: Use a more distinct hover background */
                        hover:bg-gray-100 dark:hover:bg-zinc-800 
                        hover:-translate-y-0.5 hover:shadow-md 
                        active:translate-y-0 active:shadow-sm 
                        disabled:opacity-50 disabled:cursor-not-allowed 
                        disabled:hover:translate-y-0 
                        focus:outline-none focus:ring-2 focus:ring-divider focus:ring-offset-1 dark:focus:ring-offset-zinc-900
                        ">
                Decline
            </button>
        </div>
    ) : undefined;

    return (
        <FiledLeavePage
            leave={formattedLeave}
            headName={headName}
            vpName={vpName}
            employeeName={employeeName}
            departmentName={departmentName}
            headActions={headActions}
            vpActions={vpActions}
            hasDepartmentHead={hasDepartmentHead}
            isRequestorHead={isRequestorHead} // Pass it down to update the UI badges!
        />
    );
}