// src\app\hris\(protected)\(user)\leave\file\FileEmployeePage.tsx
"use client";

import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/Loading";
import Link from "next/link";
import { submitLeaveApplication } from "@/actions/employees/leaves/action";

interface Props {
    employeeId: string;
}

export default function FileEmployeePage({ employeeId }: Props) {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const clientAction = async (formData: FormData) => {
        setIsSubmitting(true);
        setError(null);

        const result = await submitLeaveApplication(formData);

        if (result?.error) {
            setError(result.error);
            setIsSubmitting(false);
        }
    };

    return (
        <form action={clientAction} className="space-y-5">
            <input type="hidden" name="employeeId" value={employeeId} />

            {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="leaveType" className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                    Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                    id="leaveType"
                    name="leaveType"
                    required
                    defaultValue=""
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#1a6b36] focus:border-[#1a6b36] outline-none transition-colors"
                >
                    <option value="" disabled>Select a leave type...</option>
                    <option value="Vacation Leave">Vacation Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="dateFrom" className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                        Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="dateFrom"
                        name="dateFrom"
                        required
                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#1a6b36] focus:border-[#1a6b36] outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="dateTo" className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                        End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="dateTo"
                        name="dateTo"
                        required
                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#1a6b36] focus:border-[#1a6b36] outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="reason" className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                    Reason
                </label>
                <textarea
                    id="reason"
                    name="reason"
                    rows={4}
                    placeholder="Briefly explain why you need this time off..."
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#1a6b36] focus:border-[#1a6b36] outline-none transition-colors resize-y"
                ></textarea>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-100 dark:border-zinc-800">
                <Link
                    href="/hris/leave"
                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-center"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-[#1a6b36] hover:bg-[#134d26] dark:hover:bg-[#208242] rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                    {isSubmitting ? <LoadingSpinner size="sm" color="white" /> : "Submit Leave"}
                </button>
            </div>
        </form>
    );
}