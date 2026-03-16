// src/components/hris/settings/Divisions.tsx
"use client";

import { addDivision, deleteDivision, updateDivision } from "@/actions/admin/settings/divisions/action";
import { useState, useRef } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { toast } from "sonner";

type Division = {
    id: string;
    division: string;
    description: string | null;
};

interface DivisionsTemplateProps {
    data: Division[];
}

type ActionType = "add" | "update" | "delete";

interface PendingAction {
    type: ActionType;
    id?: string;
    formData?: FormData;
    divisionName?: string;
}

export default function Divisions({ data }: DivisionsTemplateProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const addFormRef = useRef<HTMLFormElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

    const handleAddClick = (formData: FormData) => {
        setPendingAction({ type: "add", formData });
        setIsModalOpen(true);
    };

    const handleUpdateClick = (id: string, formData: FormData) => {
        setPendingAction({ type: "update", id, formData });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string, name: string) => {
        setPendingAction({ type: "delete", id, divisionName: name });
        setIsModalOpen(true);
    };

    const confirmExecuteAction = async () => {
        if (!pendingAction) return;
        setIsSubmitting(true);

        try {
            if (pendingAction.type === "add" && pendingAction.formData) {
                await addDivision(pendingAction.formData);
                addFormRef.current?.reset();
                toast.success("Division added successfully");
            }
            else if (pendingAction.type === "update" && pendingAction.id && pendingAction.formData) {
                await updateDivision(pendingAction.id, pendingAction.formData);
                setEditingId(null);
                toast.success("Division updated successfully");
            }
            else if (pendingAction.type === "delete" && pendingAction.id) {
                await deleteDivision(pendingAction.id);
                toast.success("Division deleted successfully");
            }
        } catch (error) {
            console.error(`Failed to process ${pendingAction.type}:`, error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
            setPendingAction(null);
        }
    };

    const getModalConfig = () => {
        switch (pendingAction?.type) {
            case "add":
                return {
                    title: "Add Division",
                    message: "Are you sure you want to add this new division?",
                    confirmText: "Add Division",
                    colorClass: "bg-[#1a6b36] hover:bg-[#155a2b]"
                };
            case "update":
                return {
                    title: "Update Division",
                    message: "Are you sure you want to save these changes?",
                    confirmText: "Save Changes",
                    colorClass: "bg-[#1a6b36] hover:bg-[#155a2b]"
                };
            case "delete":
                return {
                    title: "Delete Division",
                    message: (
                        <>
                            Are you sure you want to permanently delete the <strong>{pendingAction.divisionName}</strong> division? This action cannot be undone.
                        </>
                    ),
                    confirmText: "Delete",
                    colorClass: "bg-red-600 hover:bg-red-700"
                };
            default:
                return { title: "", message: "", confirmText: "", colorClass: "" };
        }
    };

    const modalConfig = getModalConfig();

    return (
        <div className="space-y-4">
            <form ref={addFormRef} action={handleAddClick} className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input
                    type="text"
                    name="division"
                    placeholder="Division Name"
                    required
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm"
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description (Optional)"
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm"
                />
                <button type="submit" className="bg-[#1a6b36] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-800 transition">
                    Add Division
                </button>
            </form>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Description</th>
                            <th className="px-4 py-3 font-medium text-gray-700 w-32 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 capitalize">
                        {data.map((div) => (
                            <tr key={div.id}>
                                {editingId === div.id ? (
                                    <td colSpan={3} className="px-4 py-3">
                                        <form
                                            action={(formData) => handleUpdateClick(div.id, formData)}
                                            className="flex gap-2"
                                        >
                                            <input type="text" name="division" defaultValue={div.division} required className="flex-1 border rounded px-2 py-1 text-sm" />
                                            <input type="text" name="description" defaultValue={div.description || ""} className="flex-1 border rounded px-2 py-1 text-sm" />
                                            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium">Save</button>
                                            <button type="button" onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium">Cancel</button>
                                        </form>
                                    </td>
                                ) : (
                                    <>
                                        <td className="px-4 py-3 font-medium text-gray-900">{div.division}</td>
                                        <td className="px-4 py-3 text-gray-500">{div.description || "—"}</td>
                                        <td className="px-4 py-3 text-right space-x-3">
                                            <button onClick={() => setEditingId(div.id)} className="text-blue-600 hover:underline text-xs font-medium">Edit</button>
                                            <button
                                                onClick={() => handleDeleteClick(div.id, div.division)}
                                                className="text-red-600 hover:underline text-xs font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                                    No divisions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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