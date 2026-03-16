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
            if (pendingAction.type === "delete" && pendingAction.id) {
                const result = await deletePosition(pendingAction.id);

                if (result?.success === false) {
                    // Show the specific error message from the database
                    toast.error(result.message);
                } else {
                    toast.success("Position deleted successfully");
                }
            }
            // ... handle add/update similarly
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
                    colorClass: "bg-[#1a6b36] hover:bg-[#155a2b]"
                };
            case "update":
                return {
                    title: "Update Position",
                    message: "Are you sure you want to save these changes?",
                    confirmText: "Save Changes",
                    colorClass: "bg-[#1a6b36] hover:bg-[#155a2b]"
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
                    colorClass: "bg-red-600 hover:bg-red-700"
                };
            default:
                return { title: "", message: "", confirmText: "", colorClass: "" };
        }
    };

    const modalConfig = getModalConfig();

    return (
        <div className="space-y-4">
            {/* ADD FORM */}
            <form ref={addFormRef} action={handleAddClick} className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <select
                    name="department"
                    required
                    defaultValue=""
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm capitalize bg-white"
                >
                    <option value="" disabled>Select Department</option>
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
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm"
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description (Optional)"
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm"
                />
                <button type="submit" className="bg-[#1a6b36] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-800 transition">
                    Add Position
                </button>
            </form>

            {/* POSITIONS TABLE */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Department</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Description</th>
                            <th className="px-4 py-3 font-medium text-gray-700 w-32 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 capitalize">
                        {data.map((pos) => {
                            const departmentName = departments?.find(d => d.id === pos.departments_id)?.department || pos.departments_id;

                            return (
                                <tr key={pos.id}>
                                    {editingId === pos.id ? (
                                        <td colSpan={4} className="px-4 py-3">
                                            <form
                                                action={(formData) => handleUpdateClick(pos.id, formData)}
                                                className="flex gap-2"
                                            >
                                                <input type="text" name="position" defaultValue={pos.position} required className="flex-1 border rounded px-2 py-1 text-sm" />

                                                <select
                                                    name="department"
                                                    defaultValue={pos.departments_id || ""}
                                                    required
                                                    className="flex-1 border rounded px-2 py-1 text-sm bg-white"
                                                >
                                                    <option value="" disabled>Select Department</option>
                                                    {departments?.map((dept) => (
                                                        <option key={dept.id} value={dept.id}>
                                                            {dept.department}
                                                        </option>
                                                    ))}
                                                </select>

                                                <input type="text" name="description" defaultValue={pos.description || ""} className="flex-1 border rounded px-2 py-1 text-sm" />
                                                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium">Save</button>
                                                <button type="button" onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium">Cancel</button>
                                            </form>
                                        </td>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3 font-medium text-gray-900">{pos.position}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{departmentName}</td>
                                            <td className="px-4 py-3 text-gray-500">{pos.description || "—"}</td>
                                            <td className="px-4 py-3 text-right space-x-3">
                                                <button onClick={() => setEditingId(pos.id)} className="text-blue-600 hover:underline text-xs font-medium">Edit</button>
                                                <button
                                                    onClick={() => handleDeleteClick(pos.id, pos.position)}
                                                    className="text-red-600 hover:underline text-xs font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
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