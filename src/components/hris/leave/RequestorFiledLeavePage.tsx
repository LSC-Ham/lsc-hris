"use client";

// Make sure to create and import your delete action here
import { deleteLeaveRequest, updateDepartmentLeaveStatus } from "@/actions/employees/leaves/action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FiledLeavePage from "./FiledLeavePage";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

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
    isOwner?: boolean; // <-- ADDED THIS
}

export default function RequestorFiledLeavePage({
    leave, departmentRole, headName, vpName, rank, department,
    employeeName, departmentName, hasDepartmentHead = true, isRequestorHead = false, isOwner = false
}: Props) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    // MODAL STATE
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: React.ReactNode;
        onConfirm: () => void;
        confirmColor?: string;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });

    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    // --- EXISTING FORMATTERS ---
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

    // --- ACTION LOGIC ---

    const handleStatusUpdate = async (newStatus: number) => {
        setIsUpdating(true);
        try {
            const response = await updateDepartmentLeaveStatus(leave.id, newStatus);
            if (!response.success) throw new Error(response.error);
            toast.success("Leave status updated successfully");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update status.");
        } finally {
            setIsUpdating(false);
            closeModal();
        }
    };

    const handleDelete = async () => {
        setIsUpdating(true);
        try {
            const response = await deleteLeaveRequest(leave.id);
            if (!response.success) throw new Error(response.error);

            toast.success("Leave request deleted");
            router.push('/hris/leave');
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete request.");
            setIsUpdating(false);
            closeModal();
        }
    };

    // --- MODAL TRIGGERS ---

    const triggerConfirmStatus = (status: number, actionType: 'approve' | 'decline') => {
        setModalConfig({
            isOpen: true,
            title: actionType === 'approve' ? "Confirm Approval" : "Confirm Decline",
            message: `Are you sure you want to ${actionType} this leave request for ${employeeName}?`,
            confirmColor: actionType === 'approve' ? "bg-[#1a6b36] hover:bg-[#155a2b]" : "bg-red-600 hover:bg-red-700",
            onConfirm: () => handleStatusUpdate(status)
        });
    };

    const triggerDeleteConfirm = () => {
        setModalConfig({
            isOpen: true,
            title: "Delete Leave Request",
            message: "Are you sure you want to delete this leave request? This action cannot be undone and will remove the record from the system.",
            confirmColor: "bg-red-600 hover:bg-red-700",
            onConfirm: handleDelete
        });
    };

    // --- BUTTON STYLES ---
    const btnBase = "cursor-pointer flex-1 inline-flex justify-center items-center px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    const btnApprove = `${btnBase} bg-brand text-white shadow-sm hover:bg-brand-dark hover:-translate-y-0.5`;
    const btnDecline = `${btnBase} bg-surface border border-divider text-foreground hover:bg-gray-100 hover:-translate-y-0.5`;
    const btnDanger = `cursor-pointer inline-flex justify-center items-center px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20`;

    const ActionButtons = ({ approveStatus, declineStatus }: { approveStatus: number, declineStatus: number }) => (
        <div className="flex gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            <button
                disabled={isUpdating}
                onClick={() => triggerConfirmStatus(approveStatus, 'approve')}
                className={btnApprove}
            >
                Approve
            </button>
            <button
                disabled={isUpdating}
                onClick={() => triggerConfirmStatus(declineStatus, 'decline')}
                className={btnDecline}
            >
                Decline
            </button>
        </div>
    );

    const isHead = ["head", "assistant head"].includes(departmentRole?.toLowerCase() || "");
    const canApproveFinal = rank?.toLowerCase() === "vice president" || department?.toLowerCase() === "human resource";

    const headActions = (isHead && leave.status === null && hasDepartmentHead !== false && !isRequestorHead)
        ? <ActionButtons approveStatus={1} declineStatus={0} />
        : undefined;

    const skipsHeadApproval = hasDepartmentHead === false || isRequestorHead;
    const canVpActNow = leave.status === 1 || (leave.status === null && skipsHeadApproval);

    const vpActions = (canApproveFinal && canVpActNow)
        ? <ActionButtons approveStatus={3} declineStatus={2} />
        : undefined;

    const requestorActions = (isOwner && leave.status === null) ? (
        <button
            disabled={isUpdating}
            onClick={triggerDeleteConfirm}
            className={btnDanger}
        >
            Delete Leave Request
        </button>
    ) : undefined;

    return (
        <>
            <FiledLeavePage
                leave={formattedLeave}
                headName={headName}
                vpName={vpName}
                employeeName={employeeName}
                departmentName={departmentName}
                headActions={headActions}
                vpActions={vpActions}
                requestorActions={requestorActions}
                hasDepartmentHead={hasDepartmentHead}
                isRequestorHead={isRequestorHead}
            />

            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                isConfirming={isUpdating}
                confirmColorClass={modalConfig.confirmColor}
            />
        </>
    );
}