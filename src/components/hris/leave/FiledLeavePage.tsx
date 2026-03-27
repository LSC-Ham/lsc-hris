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
    requestorActions?: React.ReactNode;
    hasDepartmentHead?: boolean;
    isRequestorHead?: boolean;
}

export default function FiledLeavePage({
    leave, headName, vpName, employeeName, departmentName,
    headActions, vpActions, requestorActions, hasDepartmentHead = true, isRequestorHead = false
}: Props) {

    const skipsHeadApproval = hasDepartmentHead === false || isRequestorHead;

    const badgeStyle = (color: string) => {
        const colors: Record<string, string> = {
            red: "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-400/20",
            blue: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-400/20",
            amber: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-400/20",
            emerald: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/20",
            muted: "bg-gray-50 text-gray-500 border-divider dark:bg-zinc-800/50 dark:text-zinc-500"
        };
        return `inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colors[color]}`;
    };

    const inputClasses = "w-full p-2.5 rounded-lg border border-transparent bg-gray-50 dark:bg-zinc-800/50 text-gray-800 dark:text-zinc-200 cursor-not-allowed outline-none uppercase text-sm";

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">Full name</label>
                    <input type="text" value={employeeName || "N/A"} disabled className={inputClasses} />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">Department</label>
                    <input type="text" value={departmentName || "N/A"} disabled className={inputClasses} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">Date of File</label>
                    <input type="text" value={new Date(leave.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} disabled className={inputClasses} />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">Leave Type</label>
                    <input type="text" value={leave.leave_type} disabled className={inputClasses} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">Leave Date</label>
                    <input type="text" value={leave.date} disabled className={inputClasses} />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">Time From</label>
                    <input type="text" value={leave.time_from} disabled className={inputClasses} />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">Time To</label>
                    <input type="text" value={leave.time_to} disabled className={inputClasses} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase">Reason</label>
                <div className={`${inputClasses} min-h-[100px] normal-case`}>
                    {leave.reason || "No reason provided."}
                </div>
            </div>

            <div className="pt-8 mt-8 border-t border-divider">
                <h3 className="text-xs font-bold text-gray-400 dark:text-zinc-500 mb-6 uppercase tracking-[0.2em]">
                    Signatories & Approvals
                </h3>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 p-5 rounded-xl border border-divider bg-white dark:bg-zinc-900/50 shadow-sm flex flex-col justify-between transition-colors">
                        <div>
                            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold mb-1 uppercase tracking-tight">Noted by:</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 truncate uppercase">
                                {headName || "---"}
                            </p>
                        </div>
                        <div className="mt-6">
                            {headActions ? (
                                headActions
                            ) : skipsHeadApproval ? (
                                <span className={badgeStyle("muted")}>Not Required</span>
                            ) : leave.status === 0 ? (
                                <span className={badgeStyle("red")}>Declined</span>
                            ) : (leave.status !== null && leave.status >= 1) ? (
                                <span className={badgeStyle("blue")}>Approved</span>
                            ) : (
                                <span className={badgeStyle("amber")}>Pending</span>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 p-5 rounded-xl border border-divider bg-white dark:bg-zinc-900/50 shadow-sm flex flex-col justify-between transition-colors">
                        <div>
                            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold mb-1 uppercase tracking-tight">Approved by:</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 truncate uppercase">
                                {vpName || "---"}
                            </p>
                        </div>
                        <div className="mt-6">
                            {vpActions ? (
                                vpActions
                            ) : leave.status === 2 ? (
                                <span className={badgeStyle("red")}>Declined</span>
                            ) : leave.status === 3 ? (
                                <span className={badgeStyle("emerald")}>Fully Approved</span>
                            ) : leave.status === 1 || (leave.status === null && skipsHeadApproval) ? (
                                <span className={badgeStyle("blue")}>Pending Final Approval</span>
                            ) : leave.status === 0 ? (
                                <span className={badgeStyle("muted")}>Stopped at Head Level</span>
                            ) : (
                                <span className={badgeStyle("muted")}>Waiting for Head</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {requestorActions && (
                <div className="pt-6 mt-6 flex justify-end">
                    {requestorActions}
                </div>
            )}
        </div>
    );
}