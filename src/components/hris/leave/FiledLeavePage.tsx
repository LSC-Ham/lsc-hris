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
    headName?: string;
    vpName?: string;
    employeeName?: string;
    departmentName?: string;
    headActions?: React.ReactNode;
    vpActions?: React.ReactNode;
    hasDepartmentHead?: boolean;
    isRequestorHead?: boolean;
}

export default function FiledLeavePage({
    leave, headName, vpName, employeeName, departmentName,
    headActions, vpActions, hasDepartmentHead = true, isRequestorHead = false
}: Props) {

    const skipsHeadApproval = hasDepartmentHead === false || isRequestorHead;

    return (
        <div className="space-y-6">
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
                    <input type="date" value={leave.created_at} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Leave Type</label>
                    <input type="text" value={leave.leave_type} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Leave Date</label>
                    <input type="date" value={leave.date} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Time From</label>
                    <input type="time" value={leave.time_from} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Time To</label>
                    <input type="time" value={leave.time_to} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Reason</label>
                <textarea rows={4} value={leave.reason || "No reason provided."} disabled className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none resize-none"></textarea>
            </div>

            <div className="pt-6 mt-6 border-t border-divider">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
                    Signatories & Approvals
                </h3>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* 1. DEPARTMENT HEAD SECTION */}
                    <div className="flex-1 p-4 rounded-xl border border-divider bg-background shadow-sm flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] text-muted font-bold mb-1 uppercase">Noted by:</p>
                            <p className="text-[10px] text-muted font-bold mb-1 uppercase">Department Head</p>
                            <p className="text-sm font-bold text-foreground truncate">
                                {headName}
                            </p>
                        </div>
                        <div className="mt-4">
                            {headActions ? (
                                headActions
                            ) : skipsHeadApproval ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-background text-muted border border-divider">
                                    Not Required
                                </span>
                            ) : leave.status === 0 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
                                    Declined
                                </span>
                            ) : (leave.status !== null && leave.status >= 1) ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                                    Approved
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                                    Pending
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 2. VP ADMIN / HR SECTION */}
                    <div className="flex-1 p-4 rounded-xl border border-divider bg-background shadow-sm flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] text-muted font-bold mb-1 uppercase">Approved by:</p>
                            <p className="text-[10px] text-muted font-bold mb-1 uppercase">Vice President / HR</p>
                            <p className="text-sm font-bold text-foreground truncate">
                                {vpName}
                            </p>
                        </div>
                        <div className="mt-4">
                            {vpActions ? (
                                vpActions
                            ) : leave.status === 2 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
                                    Declined
                                </span>
                            ) : leave.status === 3 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                    Fully Approved
                                </span>
                            ) : leave.status === 1 || (leave.status === null && skipsHeadApproval) ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                                    Pending Final Approval
                                </span>
                            ) : leave.status === 0 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-background text-muted border border-divider">
                                    Stopped at Head Level
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-background text-muted border border-divider">
                                    Waiting for Head
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}