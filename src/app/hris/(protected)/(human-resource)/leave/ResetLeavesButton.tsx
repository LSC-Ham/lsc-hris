//src\app\hris\(protected)\(human-resource)\leave\ResetLeavesButton.tsx
"use client";

import { useState } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { toast } from "sonner";
import { resetEmployeeLeaves } from "@/actions/employees/leaves/action";

export default function ResetLeavesButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleReset = async () => {
        setIsPending(true);
        const result = await resetEmployeeLeaves();

        if (result.success) {
            toast.success("All employee leaves have been reset successfully.");
            setIsOpen(false);
        } else {
            toast.error(result.error || "Something went wrong.");
        }
        setIsPending(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#1a6b36] hover:bg-[#134d26] dark:bg-[#1a6b36] dark:hover:bg-[#208242] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm text-center w-full md:w-auto"
            >
                Reset Leaves
            </button>

            <ConfirmModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleReset}
                isConfirming={isPending}
                title="Reset Annual Leaves"
                confirmColorClass="bg-red-600 hover:bg-red-700"
                confirmText="Reset Now"
                message={
                    <div className="space-y-2">
                        <p>Are you sure you want to reset the leave credits for <strong>all employees</strong>?</p>
                        <p className="text-xs text-red-500 font-medium">This action will be logged with your name and today's date. This cannot be undone.</p>
                    </div>
                }
            />
        </>
    );
}