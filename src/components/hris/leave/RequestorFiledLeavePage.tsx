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

    // Shared Button Classes for consistency
    const btnBase = "cursor-pointer flex-1 inline-flex justify-center items-center px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none";

    const btnApprove = `${btnBase} bg-brand text-white shadow-sm hover:bg-brand-dark hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-zinc-900`;

    const btnDecline = `${btnBase} bg-surface border border-divider text-foreground hover:bg-gray-100 dark:hover:bg-zinc-800 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-divider focus:ring-offset-2 dark:focus:ring-offset-zinc-900`;

    const ActionButtons = ({ approveStatus, declineStatus }: { approveStatus: number, declineStatus: number }) => (
        <div className="flex gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            <button
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(approveStatus)}
                className={btnApprove}
            >
                {isUpdating ? "Processing..." : "Approve"}
            </button>

            <button
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(declineStatus)}
                className={btnDecline}
            >
                Decline
            </button>
        </div>
    );

    const headActions = (isHead && leave.status === null && hasDepartmentHead !== false && !isRequestorHead)
        ? <ActionButtons approveStatus={1} declineStatus={0} />
        : undefined;

    const skipsHeadApproval = hasDepartmentHead === false || isRequestorHead;
    const canVpActNow = leave.status === 1 || (leave.status === null && skipsHeadApproval);

    const vpActions = (canApproveFinal && canVpActNow)
        ? <ActionButtons approveStatus={3} declineStatus={2} />
        : undefined;

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
            isRequestorHead={isRequestorHead}
        />
    );
}