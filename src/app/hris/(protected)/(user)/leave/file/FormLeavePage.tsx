// src\app\hris\(protected)\(user)\leave\file\FileEmployeePage.tsx
"use client";

import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/Loading";
import Link from "next/link";
import { submitLeaveApplication } from "@/actions/employees/leaves/action";

interface Props {
    employeeId: string;
}

interface LeaveEntry {
    leave_type: string;
    date: string;
    time_from: string;
    time_to: string;
    reason: string;
}

export default function FormLeavePage({ employeeId }: Props) {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [leavesList, setLeavesList] = useState<LeaveEntry[]>([]);
    const [currentLeave, setCurrentLeave] = useState<LeaveEntry>({
        leave_type: "",
        date: "",
        time_from: "",
        time_to: "",
        reason: "",
    });

    const isBuilderValid =
        currentLeave.leave_type.trim() !== "" &&
        currentLeave.date.trim() !== "" &&
        currentLeave.time_from.trim() !== "" &&
        currentLeave.time_to.trim() !== "";

    const handleInputChange = (field: keyof LeaveEntry, value: string) => {
        setCurrentLeave((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddLeave = () => {
        if (isBuilderValid) {
            setLeavesList((prev) => [...prev, currentLeave]);
            setCurrentLeave((prev) => ({
                ...prev,
                date: "",
                time_from: "",
                time_to: "",
            }));
        }
    };

    const handleRemoveLeave = (indexToRemove: number) => {
        setLeavesList((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    // --- Submission Logic ---
    const clientAction = async (formData: FormData) => {
        if (leavesList.length === 0) {
            setError("Please add at least one leave to submit.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        formData.append("leavesData", JSON.stringify(leavesList));

        const result = await submitLeaveApplication(formData);

        if (result?.error) {
            setError(result.error);
            setIsSubmitting(false);
        }
    };

    const formatTimeDisplay = (timeString: string) => {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const inputClassName = "w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-100 outline-none transition-colors focus:ring-2 focus:ring-[#1a6b36] focus:border-transparent focus:bg-white dark:focus:bg-zinc-900";

    return (
        <form action={clientAction} className="space-y-6">
            <input type="hidden" name="employeeId" value={employeeId} />

            {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="leave_type" className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                        Leave Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="leave_type"
                        value={currentLeave.leave_type}
                        onChange={(e) => handleInputChange("leave_type", e.target.value)}
                        className={inputClassName}
                    >
                        <option value="" disabled>Select a leave type...</option>
                        <option value="Vacation Leave">Vacation Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Emergency Leave">Emergency Leave</option>
                        <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="date" className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                            Leave Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={currentLeave.date}
                            onChange={(e) => handleInputChange("date", e.target.value)}
                            className={`${inputClassName} [color-scheme:light] dark:[color-scheme:dark]`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="time_from" className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                            Time From <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            id="time_from"
                            value={currentLeave.time_from}
                            onChange={(e) => handleInputChange("time_from", e.target.value)}
                            className={`${inputClassName} [color-scheme:light] dark:[color-scheme:dark]`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="time_to" className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                            Time To <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            id="time_to"
                            value={currentLeave.time_to}
                            onChange={(e) => handleInputChange("time_to", e.target.value)}
                            className={`${inputClassName} [color-scheme:light] dark:[color-scheme:dark]`}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="reason" className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                        Reason
                    </label>
                    <textarea
                        id="reason"
                        rows={4}
                        value={currentLeave.reason}
                        onChange={(e) => handleInputChange("reason", e.target.value)}
                        placeholder="Briefly explain why you need this time off..."
                        className={`${inputClassName} resize-none`}
                    ></textarea>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={handleAddLeave}
                        disabled={!isBuilderValid}
                        className="bg-gray-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        + Add to Application
                    </button>
                </div>
            </div>

            {leavesList.length > 0 && (
                <div className="pt-6 mt-6 border-t border-gray-200 dark:border-zinc-800 space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider">
                        Leaves to Submit ({leavesList.length})
                    </h3>
                    <div className="space-y-3">
                        {leavesList.map((leave, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-[#1a6b36] dark:text-[#2dc563]">
                                            {leave.leave_type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-zinc-300 font-medium">
                                        {new Date(leave.date).toLocaleDateString()} • {formatTimeDisplay(leave.time_from)} to {formatTimeDisplay(leave.time_to)}
                                    </p>
                                    {leave.reason && (
                                        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                                            {leave.reason}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveLeave(index)}
                                    className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-900/50 rounded-md transition-colors sm:w-auto text-center self-start sm:self-center shrink-0"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- FORM ACTIONS --- */}
            <div className="pt-6 mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-200 dark:border-zinc-800">
                <Link
                    href="/hris/leave"
                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-center"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitting || leavesList.length === 0}
                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-[#1a6b36] hover:bg-[#134d26] dark:hover:bg-[#208242] rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]"
                >
                    {isSubmitting ? <LoadingSpinner size="sm" color="white" /> : `Submit Application`}
                </button>
            </div>
        </form>
    );
}