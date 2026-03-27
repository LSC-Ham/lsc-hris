"use client";

import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/Loading";
import Link from "next/link";
import { submitLeaveApplication } from "@/actions/employees/leaves/action";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

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
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleConfirmSubmit = () => {
        setIsModalOpen(false);
        const formData = new FormData();
        formData.append("employeeId", employeeId);
        clientAction(formData);
    };

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

    const labelClasses = "text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wide";
    const inputClasses = "w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-100 outline-none transition-colors focus:ring-2 focus:ring-[#1a6b36] focus:border-transparent focus:bg-white dark:focus:bg-zinc-900 text-sm";

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setIsModalOpen(true);
                }}
                className="space-y-6"
            >
                <input type="hidden" name="employeeId" value={employeeId} />

                {error && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="leave_type" className={labelClasses}>
                            Leave Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="leave_type"
                            value={currentLeave.leave_type}
                            onChange={(e) => handleInputChange("leave_type", e.target.value)}
                            className={inputClasses}
                        >
                            <option value="" disabled>Select a leave type...</option>
                            <option value="Vacation Leave">Vacation Leave</option>
                            <option value="Sick Leave">Sick Leave</option>
                            <option value="Emergency Leave">Emergency Leave</option>
                            <option value="Leave Without Pay">Leave Without Pay</option>
                            <option value="Undertime">Undertime</option>
                            <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="date" className={labelClasses}>
                                Leave Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="date"
                                max="2099-12-31"
                                value={currentLeave.date}
                                onChange={(e) => handleInputChange("date", e.target.value)}
                                className={`${inputClasses} [color-scheme:light] dark:[color-scheme:dark]`}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="time_from" className={labelClasses}>
                                Time From <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                id="time_from"
                                value={currentLeave.time_from}
                                onChange={(e) => handleInputChange("time_from", e.target.value)}
                                className={`${inputClasses} [color-scheme:light] dark:[color-scheme:dark]`}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="time_to" className={labelClasses}>
                                Time To <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                id="time_to"
                                value={currentLeave.time_to}
                                onChange={(e) => handleInputChange("time_to", e.target.value)}
                                className={`${inputClasses} [color-scheme:light] dark:[color-scheme:dark]`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="reason" className={labelClasses}>
                            Reason
                        </label>
                        <textarea
                            id="reason"
                            rows={4}
                            value={currentLeave.reason}
                            onChange={(e) => handleInputChange("reason", e.target.value)}
                            placeholder="Briefly explain why you need this time off..."
                            className={`${inputClasses} resize-none`}
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleAddLeave}
                            disabled={!isBuilderValid}
                            className="cursor-pointer bg-[#1a6b36] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#155a2b] disabled:opacity-50 transition-colors shadow-sm disabled:cursor-not-allowed"
                        >
                            + Add to Application
                        </button>
                    </div>
                </div>

                {leavesList.length > 0 && (
                    <div className="pt-8 mt-8 border-t border-gray-200 dark:border-zinc-800 space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                            Leaves to Submit ({leavesList.length})
                        </h3>
                        <div className="space-y-3">
                            {leavesList.map((leave, index) => (
                                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl gap-4 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-[#1a6b36] dark:text-[#2dc563] uppercase tracking-wider">
                                                {leave.leave_type}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-800 dark:text-zinc-200 font-medium">
                                            {new Date(leave.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {formatTimeDisplay(leave.time_from)} to {formatTimeDisplay(leave.time_to)}
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
                                        className="cursor-pointer text-[10px] text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold uppercase tracking-wider px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-900/50 rounded-md transition-colors sm:w-auto text-center self-start sm:self-center shrink-0"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-6 mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-200 dark:border-zinc-800">
                    <Link
                        href="/hris/leave"
                        className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-center"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting || leavesList.length === 0}
                        className="cursor-pointer w-full sm:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#1a6b36] hover:bg-[#134d26] dark:hover:bg-[#208242] rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                    >
                        {isSubmitting ? <LoadingSpinner size="sm" color="white" /> : `Submit Application`}
                    </button>
                </div>
            </form>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmSubmit}
                title="Submit Leave Application"
                subtitle="Please review your entries"
                message={
                    <div className="space-y-2">
                        <p>Are you sure you want to submit this leave application with <strong>{leavesList.length}</strong> entry/ies?</p>
                        <p className="text-xs italic text-gray-500">Once submitted, this will be sent to your department head for review.</p>
                    </div>
                }
                confirmText="Submit Now"
                isConfirming={isSubmitting}
            />
        </>
    );
}