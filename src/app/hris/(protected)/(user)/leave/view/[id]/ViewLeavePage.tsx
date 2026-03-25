"use client";

//import { useRouter } from "next/navigation";

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
}

export default function ViewLeavePage({ leave, headName }: Props) {
    //const router = useRouter();

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split('T')[0];
    };

    const formatTimeForInput = (timeString: string) => {
        if (!timeString) return "";
        const dateObj = new Date(timeString);
        return dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                        Date of File
                    </label>
                    <input
                        type="date"
                        value={formatDateForInput(leave.created_at)}
                        disabled
                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                        Leave Type
                    </label>
                    <input
                        type="text"
                        value={leave.leave_type}
                        disabled
                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                        Leave Date
                    </label>
                    <input
                        type="date"
                        value={formatDateForInput(leave.date)}
                        disabled
                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                        Time From
                    </label>
                    <input
                        type="time"
                        value={formatTimeForInput(leave.time_from)}
                        disabled
                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                        Time To
                    </label>
                    <input
                        type="time"
                        value={formatTimeForInput(leave.time_to)}
                        disabled
                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                    Reason
                </label>
                <textarea
                    rows={4}
                    value={leave.reason || "No reason provided."}
                    disabled
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-zinc-400 cursor-not-allowed outline-none transition-colors resize-none"
                ></textarea>
            </div>

            <div className="pt-6 mt-6 border-t border-divider transition-colors duration-300">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
                    Signatories & Approvals
                </h3>

                <div className="flex flex-row gap-4">
                    <div className="w-full p-4 rounded-xl border border-divider bg-surface shadow-sm flex flex-col justify-between">
                        <div className="truncate">
                            <p className="text-[10px] text-muted font-medium mb-1 uppercase">Department Head</p>
                            <p className="text-sm font-bold text-foreground truncate">{headName}</p>
                        </div>
                        <div className="mt-4">
                            {leave.status === 1 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-brand/10 text-brand border border-brand/20">
                                    Approved
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border border-divider bg-surface shadow-sm flex flex-col justify-between w-full">
                        <div>
                            <p className="text-[10px] text-muted font-medium mb-1 uppercase">VP Admin</p>
                            <p className="text-sm font-bold text-foreground truncate">Maria Clara</p>
                        </div>
                        <div className="mt-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-accent/10 text-[color:var(--color-accent)] border border-accent/20">
                                Pending
                            </span>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border border-divider bg-surface shadow-sm flex flex-col justify-between w-full">
                        <div>
                            <p className="text-[10px] text-muted font-medium mb-1 uppercase">HR Manager</p>
                            <p className="text-sm font-bold text-foreground truncate">Jose Rizal</p>
                        </div>
                        <div className="mt-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-muted/10 text-muted border border-divider">
                                Waiting
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}