// src/components/hris/settings/Positions.tsx
"use client";

import { addPosition, deletePosition, updatePosition } from "@/actions/admin/settings/positions/action";
import { useState, useRef } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { toast } from "sonner";

type Position = {
    id: string;
    position: string;
    departments_id: string | null;
    description: string | null;
};

type Department = {
    id: string;
    department: string;
};

interface PositionsTemplateProps {
    data: Position[];
    departments: Department[];
}

type ActionType = "add" | "update" | "delete";

interface PendingAction {
    type: ActionType;
    id?: string;
    formData?: FormData;
    positionName?: string;
}

export default function Positions({ data, departments }: PositionsTemplateProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const addFormRef = useRef<HTMLFormElement>(null);

    // --- MODAL STATES ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

    // 1. Intercept Add Action
    const handleAddClick = (formData: FormData) => {
        setPendingAction({ type: "add", formData });
        setIsModalOpen(true);
    };

    // 2. Intercept Update Action
    const handleUpdateClick = (id: string, formData: FormData) => {
        setPendingAction({ type: "update", id, formData });
        setIsModalOpen(true);
    };

    // 3. Intercept Delete Action
    const handleDeleteClick = (id: string, name: string) => {
        setPendingAction({ type: "delete", id, positionName: name });
        setIsModalOpen(true);
    };

    // 4. Execute the staged action
    const confirmExecuteAction = async () => {
        if (!pendingAction) return;
        setIsSubmitting(true);

        try {
            if (pendingAction.type === "add" && pendingAction.formData) {
                await addPosition(pendingAction.formData);
                addFormRef.current?.reset();
                toast.success("Position added successfully");
            }
            else if (pendingAction.type === "update" && pendingAction.id && pendingAction.formData) {
                await updatePosition(pendingAction.id, pendingAction.formData);
                setEditingId(null);
                toast.success("Position updated successfully");
            }
            else if (pendingAction.type === "delete" && pendingAction.id) {
                const result = await deletePosition(pendingAction.id);

                if (result?.success === false) {
                    toast.error(result.message);
                } else {
                    toast.success("Position deleted successfully");
                }
            }
        } catch (error) {
            toast.error("A network error occurred.");
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
            setPendingAction(null);
        }
    };

    // --- Dynamic Modal Configuration ---
    const getModalConfig = () => {
        switch (pendingAction?.type) {
            case "add":
                return {
                    title: "Add Position",
                    message: "Are you sure you want to add this new position?",
                    confirmText: "Add Position",
                    colorClass: "bg-[#1a6b36] hover:bg-[#155a2b] dark:bg-green-700 dark:hover:bg-green-600"
                };
            case "update":
                return {
                    title: "Update Position",
                    message: "Are you sure you want to save these changes?",
                    confirmText: "Save Changes",
                    colorClass: "bg-[#1a6b36] hover:bg-[#155a2b] dark:bg-green-700 dark:hover:bg-green-600"
                };
            case "delete":
                return {
                    title: "Delete Position",
                    message: (
                        <>
                            Are you sure you want to permanently delete the <strong>{pendingAction.positionName}</strong> position? This action cannot be undone.
                        </>
                    ),
                    confirmText: "Delete",
                    colorClass: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                };
            default:
                return { title: "", message: "", confirmText: "", colorClass: "" };
        }
    };

    const modalConfig = getModalConfig();

    return (
        <div className="space-y-6">
            <form ref={addFormRef} action={handleAddClick} className="flex flex-col sm:flex-row gap-3 bg-gray-50 dark:bg-zinc-950/50 p-4 rounded-lg border border-gray-200 dark:border-zinc-800">
                <select
                    name="department"
                    required
                    defaultValue=""
                    className="flex-1 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 px-3 py-2 rounded-md text-sm capitalize focus:outline-none focus:ring-2 focus:ring-[#1a6b36]"
                >
                    <option value="" disabled className="text-gray-500">Select Department</option>
                    {departments?.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.department}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="position"
                    placeholder="Position Name"
                    required
                    className="flex-1 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b36]"
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description (Optional)"
                    className="flex-1 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b36]"
                />
                <button type="submit" className="bg-[#1a6b36] dark:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-[#155a2b] dark:hover:bg-green-600 transition shadow-sm whitespace-nowrap">
                    Add Position
                </button>
            </form>

            {/* POSITIONS TABLE - Horizontally Scrollable on Mobile */}
            <div className="border border-gray-200 dark:border-zinc-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-zinc-950/50 border-b border-gray-200 dark:border-zinc-800">
                        <tr>
                            <th className="px-4 py-3 font-medium text-gray-700 dark:text-zinc-300 w-1/4">Name</th>
                            <th className="px-4 py-3 font-medium text-gray-700 dark:text-zinc-300 w-1/4">Department</th>
                            <th className="px-4 py-3 font-medium text-gray-700 dark:text-zinc-300 w-1/3">Description</th>
                            <th className="px-4 py-3 font-medium text-gray-700 dark:text-zinc-300 w-32 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 capitalize">
                        {data.map((pos) => {
                            const departmentName = departments?.find(d => d.id === pos.departments_id)?.department || pos.departments_id;

                            return (
                                <tr key={pos.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                    {editingId === pos.id ? (
                                        <td colSpan={4} className="px-4 py-3">
                                            <form
                                                action={(formData) => handleUpdateClick(pos.id, formData)}
                                                className="flex flex-col sm:flex-row gap-2"
                                            >
                                                <input
                                                    type="text"
                                                    name="position"
                                                    defaultValue={pos.position}
                                                    required
                                                    className="flex-1 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 px-2 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1a6b36]"
                                                />
                                                <select
                                                    name="department"
                                                    defaultValue={pos.departments_id || ""}
                                                    required
                                                    className="flex-1 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 px-2 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1a6b36]"
                                                >
                                                    <option value="" disabled className="text-gray-500">Select Department</option>
                                                    {departments?.map((dept) => (
                                                        <option key={dept.id} value={dept.id}>
                                                            {dept.department}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    name="description"
                                                    defaultValue={pos.description || ""}
                                                    className="flex-1 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 px-2 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1a6b36]"
                                                />
                                                <div className="flex gap-2 justify-end sm:justify-start">
                                                    <button type="submit" className="bg-[#1a6b36] dark:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-[#155a2b] dark:hover:bg-green-600 transition">Save</button>
                                                    <button type="button" onClick={() => setEditingId(null)} className="bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-300 dark:hover:bg-zinc-700 transition px-3 py-1.5 rounded text-xs font-medium">Cancel</button>
                                                </div>
                                            </form>
                                        </td>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-100">{pos.position}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-100">{departmentName}</td>
                                            <td className="px-4 py-3 text-gray-500 dark:text-zinc-400">{pos.description || "—"}</td>
                                            <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingId(pos.id)}
                                                    className="cursor-pointer p-2 inline-flex items-center justify-center text-gray-400 hover:text-[#1a6b36] dark:hover:text-green-500 hover:bg-[#1a6b36]/5 dark:hover:bg-[#1a6b36]/10 rounded-lg transition-colors"
                                                    title="Edit Record"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick(pos.id, pos.position)}
                                                    className="cursor-pointer p-2 inline-flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete Record"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-zinc-500">
                                    No positions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* CONFIRMATION MODAL */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => {
                    if (!isSubmitting) {
                        setIsModalOpen(false);
                        setPendingAction(null);
                    }
                }}
                onConfirm={confirmExecuteAction}
                isConfirming={isSubmitting}
                title={modalConfig.title}
                message={<p>{modalConfig.message}</p>}
                confirmText={modalConfig.confirmText}
                confirmColorClass={modalConfig.colorClass}
            />
        </div>
    );
}