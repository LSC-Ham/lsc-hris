"use client";

import { useState } from "react";

export interface EligibilityRecord {
    id?: string;
    qualification: string;
    rating: string;
    date_examination: string;
    place_examination: string;
    id_number: string;
    date_validity: string;
}

interface EligibilityProps {
    mode?: "view",
    formData: EligibilityRecord[];
    onSave?: (updatedData: EligibilityRecord[]) => Promise<void>;
}

const emptyRecord: EligibilityRecord = {
    qualification: "",
    rating: "",
    date_examination: "",
    place_examination: "",
    id_number: "",
    date_validity: "",
};

export function Eligibility({ mode, formData = [], onSave }: EligibilityProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [draftData, setDraftData] = useState<EligibilityRecord>(emptyRecord);
    const [isSaving, setIsSaving] = useState(false);

    const handleLocalChange = (field: keyof EligibilityRecord, value: string) => {
        setDraftData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddNew = () => {
        setDraftData(emptyRecord);
        setEditingIndex(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (index: number) => {
        setDraftData({ ...formData[index] });
        setEditingIndex(index);
        setIsFormOpen(true);
    };

    const handleDeleteClick = async (index: number) => {
        if (!window.confirm("Are you sure you want to remove this eligibility record?")) return;
        const updatedRecords = [...formData];
        updatedRecords.splice(index, 1);
        if (onSave) {
            await onSave(updatedRecords);
        }
    };

    const handleCancel = () => {
        setDraftData(emptyRecord);
        setEditingIndex(null);
        setIsFormOpen(false);
    };

    const handleSaveClick = async () => {
        if (!draftData.qualification) {
            alert("Please fill in the required field: Qualification.");
            return;
        }

        setIsSaving(true);
        const updatedRecords = [...formData];

        if (editingIndex !== null) {
            updatedRecords[editingIndex] = draftData;
        } else {
            updatedRecords.push({
                ...draftData,
                id: draftData.id || crypto.randomUUID()
            });
        }
        if (onSave) {
            await onSave(updatedRecords);
        }

        setIsSaving(false);
        setIsFormOpen(false);
        setEditingIndex(null);
        setDraftData(emptyRecord);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Eligibility</h1>

                {mode !== "view" && !isFormOpen && (
                    <button
                        type="button"
                        onClick={handleAddNew}
                        className="text-[#1a6b36] text-sm font-medium hover:underline flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Eligibility
                    </button>
                )}
            </div>

            {/* FORM VIEW */}
            {isFormOpen ? (
                <div className="space-y-6 bg-gray-50/50 p-6 border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            {editingIndex !== null ? "Edit Eligibility Record" : "New Eligibility Record"}
                        </h2>
                        <button type="button" onClick={handleCancel} disabled={isSaving} className="text-gray-500 hover:text-gray-700 text-sm font-medium disabled:opacity-50">
                            Close
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField
                            label="Qualification / License"
                            value={draftData.qualification}
                            isEditing={true}
                            placeholder="CAREER SERVICE PROFESSIONAL"
                            onChange={(e: any) => handleLocalChange("qualification", e.target.value)}
                            required
                        />
                        <ProfileField
                            label="Rating (if applicable)"
                            value={draftData.rating}
                            isEditing={true}
                            placeholder="85.50%"
                            onChange={(e: any) => handleLocalChange("rating", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField
                            label="Date of Examination"
                            value={draftData.date_examination}
                            type="date"
                            isEditing={true}
                            onChange={(e: any) => handleLocalChange("date_examination", e.target.value)}
                        />
                        <ProfileField
                            label="Place of Examination"
                            value={draftData.place_examination}
                            isEditing={true}
                            placeholder="MANILA / ONLINE"
                            onChange={(e: any) => handleLocalChange("place_examination", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField
                            label="License Number (if applicable)"
                            value={draftData.id_number}
                            isEditing={true}
                            placeholder="0012345"
                            onChange={(e: any) => handleLocalChange("id_number", e.target.value)}
                        />
                        <ProfileField
                            label="Date of Validity"
                            value={draftData.date_validity}
                            type="date"
                            isEditing={true}
                            onChange={(e: any) => handleLocalChange("date_validity", e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200 mt-6 gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="bg-[#1a6b36] text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            onClick={handleSaveClick}
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Confirm Record"}
                        </button>
                    </div>
                </div>
            ) : (
                /* CARD VIEW */
                <div className="space-y-4">
                    {formData.length === 0 ? (
                        <div className="p-8 text-center border border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-500 text-sm">
                            No eligibility records added yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {formData.map((record, index) => (
                                <div
                                    key={record.id || index}
                                    className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                                            Rating: {record.rating || "N/A"}
                                        </span>

                                        <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => handleEditClick(index)}
                                                className="p-1.5 text-gray-500 hover:text-[#1a6b36] hover:bg-green-50 rounded-md transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteClick(index)}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 uppercase">
                                            {record.qualification || "Unknown Qualification"}
                                        </h3>
                                        <p className="text-sm text-gray-600 font-medium uppercase italic">
                                            {record.place_examination || "No Place Provided"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs mt-auto pt-4 border-t border-gray-100">
                                        <div>
                                            <span className="block text-gray-400 font-medium uppercase mb-0.5">Exam Date</span>
                                            <span className="text-gray-800 font-semibold">{record.date_examination || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 font-medium uppercase mb-0.5">License No.</span>
                                            <span className="text-gray-800 font-semibold">{record.id_number || "N/A"}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="block text-gray-400 font-medium uppercase mb-0.5">Validity</span>
                                            <span className="text-gray-800 font-semibold">{record.date_validity || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Re-using your ProfileField (Keep this in the same file or import it)
function ProfileField({ label, value, isEditing, type = "text", placeholder, onChange, required, disabled }: any) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {isEditing ? (
                <input
                    type={type}
                    value={value || ""}
                    placeholder={placeholder}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className={`w-full p-2.5 border rounded-lg text-sm transition-all shadow-sm outline-none 
                    ${type === 'text'} 
                    ${disabled
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                            : "bg-white focus:ring-1 " + (required && !value ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500")
                        }`}
                />
            ) : (
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}