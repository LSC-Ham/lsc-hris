"use client";

import { updateDepartmentLeaveStatus } from "@/actions/employees/leaves/action";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    employeeName?: string; // New prop for requestor name
    departmentName?: string; // New prop for department name
}

export default function ViewRequestorLeavePage({ leave, departmentRole, headName, vpName, rank, department, employeeName, departmentName }: Props) {
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

    // Role checks
    const isHead = ["head", "assistant head"].includes(departmentRole?.toLowerCase() || "");
    const canApproveFinal = rank?.toLowerCase() === "vice president" || department?.toLowerCase() === "human resource";

    const handleStatusUpdate = async (newStatus: number) => {
        setIsUpdating(true);
        try {
            const response = await updateDepartmentLeaveStatus(leave.id, newStatus);

            if (!response.success) {
                throw new Error(response.error);
            }

            router.refresh();
        } catch (error) {
            console.error("Failed to update leave status:", error);
            alert(error instanceof Error ? error.message : "Something went wrong while updating the leave status.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Added Employee and Department Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Full name</label>
                    <input type="text" value={employeeName || "N/A"} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Department</label>
                    <input type="text" value={departmentName || "N/A"} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Date of File</label>
                    <input type="date" value={formatDateForInput(leave.created_at)} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Leave Type</label>
                    <input type="text" value={leave.leave_type} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Leave Date</label>
                    <input type="date" value={formatDateForInput(leave.date)} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Time From</label>
                    <input type="time" value={formatTimeForInput(leave.time_from)} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Time To</label>
                    <input type="time" value={formatTimeForInput(leave.time_to)} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Reason</label>
                <textarea rows={4} value={leave.reason || "No reason provided."} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none resize-none"></textarea>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 mb-4 uppercase tracking-wider">
                    Signatories & Approvals
                </h3>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* 1. DEPARTMENT HEAD SECTION */}
                    <div className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/30 shadow-sm flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Noted by:</p>
                            <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Department Head</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 truncate">{headName}</p>
                        </div>
                        <div className="mt-4">
                            {leave.status === 0 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">Declined</span>
                            ) : (leave.status !== null && leave.status >= 1) ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">Approved</span>
                            ) : isHead && leave.status === null ? (
                                <div className="flex gap-2">
                                    <button disabled={isUpdating} onClick={() => handleStatusUpdate(1)} className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-bold bg-gray-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-all disabled:opacity-50">Approve</button>
                                    <button disabled={isUpdating} onClick={() => handleStatusUpdate(0)} className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-bold bg-white text-red-600 border border-red-200 dark:bg-zinc-900 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all disabled:opacity-50">Reject</button>
                                </div>
                            ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">Pending</span>
                            )}
                        </div>
                    </div>

                    {/* 2. VP ADMIN / HR SECTION */}
                    <div className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/30 shadow-sm flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Approved by:</p>
                            <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Vice President / HR</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 truncate">{vpName}</p>
                        </div>
                        <div className="mt-4">
                            {leave.status === 2 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">Declined</span>
                            ) : leave.status === 3 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">Fully Approved</span>
                            ) : leave.status === 1 ? (
                                canApproveFinal ? (
                                    <div className="flex gap-2">
                                        <button disabled={isUpdating} onClick={() => handleStatusUpdate(3)} className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-bold bg-gray-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-all disabled:opacity-50">Approve</button>
                                        <button disabled={isUpdating} onClick={() => handleStatusUpdate(2)} className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-bold bg-white text-red-600 border border-red-200 dark:bg-zinc-900 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all disabled:opacity-50">Reject</button>
                                    </div>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">Pending Final Approval</span>
                                )
                            ) : leave.status === 0 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-600 border border-gray-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">Stopped at Head Level</span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-600 border border-gray-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">Waiting for Head</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}