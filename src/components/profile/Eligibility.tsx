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
    onSave?: (updatedData: EligibilityRecord[]) => void;
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
    const today = new Date().toISOString().split('T')[0];


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

        setIsFormOpen(false);
        setEditingIndex(null);
        setDraftData(emptyRecord);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
                <h1 className="text-xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Eligibility</h1>
            </div>

            {isFormOpen ? (
                <div className="relative bg-white dark:bg-zinc-900 border-2 border-brand/20 dark:border-brand/30 rounded-xl shadow-md overflow-hidden transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
                    <div className="p-5 sm:p-6 space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-brand/10 dark:bg-brand/20 rounded-lg text-brand dark:text-green-500">
                                    {editingIndex !== null ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-gray-900 dark:text-zinc-100 tracking-tight uppercase">
                                        {editingIndex !== null ? "Edit Record" : "Add New Record"}
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium mt-0.5">
                                        {editingIndex !== null ? "Update your educational background details below." : "Enter the details of your educational background."}
                                    </p>
                                </div>
                            </div>
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
                                max="2099-12-31"
                                onChange={(e: any) => handleLocalChange("date_examination", e.target.value)}
                            />
                            <ProfileField
                                label="Place of Examination"
                                value={draftData.place_examination}
                                isEditing={true}
                                max="2099-12-31"
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

                        <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100 dark:border-zinc-800">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="cursor-pointer px-5 py-2 text-sm font-semibold text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSaveClick}
                                className="cursor-pointer bg-brand hover:opacity-90 text-white font-semibold text-sm px-6 py-2 rounded-lg shadow-sm shadow-brand/20 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-zinc-900 flex items-center gap-2"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {formData.map((record, index) => (
                            <div
                                key={record.id || index}
                                className="relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-all group flex flex-col justify-between"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="inline-block px-3 py-1 bg-brand/10 dark:bg-brand/20 text-brand dark:text-green-500 text-[10px] font-bold rounded-full uppercase tracking-widest">
                                        Rating: {record.rating || "N/A"}
                                    </span>
                                    {mode !== "view" && (
                                        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => handleEditClick(index)}
                                                className="p-2 text-gray-400 hover:text-brand dark:hover:text-green-500 hover:bg-brand/5 dark:hover:bg-brand/10 rounded-lg transition-colors"
                                                title="Edit Record"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteClick(index)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Record"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-5">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100 leading-snug mb-1 uppercase tracking-tight">
                                        {record.qualification}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium uppercase italic">
                                        {record.place_examination || "No Place Provided"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-[11px] mt-auto pt-4 border-t border-gray-50 dark:border-zinc-800">
                                    <div>
                                        <span className="block text-gray-400 dark:text-zinc-500 font-bold uppercase mb-0.5 tracking-tighter">Exam Date</span>
                                        <span className="text-gray-700 dark:text-zinc-300 font-semibold">{record.date_examination || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-400 dark:text-zinc-500 font-bold uppercase mb-0.5 tracking-tighter">License No.</span>
                                        <span className="text-gray-700 dark:text-zinc-300 font-semibold">{record.id_number || "N/A"}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="block text-gray-400 dark:text-zinc-500 font-bold uppercase mb-0.5 tracking-tighter">Validity</span>
                                        <span className="text-gray-700 dark:text-zinc-300 font-semibold">{record.date_validity  || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {mode !== "view" ? (
                            <button
                                type="button"
                                onClick={handleAddNew}
                                className="cursor-pointer group relative flex flex-col items-center justify-center min-h-[220px] w-full border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl p-5 bg-gray-50/50 dark:bg-zinc-900/30 text-gray-500 dark:text-zinc-400 hover:border-brand hover:dark:border-green-500 hover:bg-brand/5 hover:dark:bg-brand/10 transition-all outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-3 bg-white dark:bg-zinc-800 text-gray-400 group-hover:text-brand dark:group-hover:text-green-500 rounded-full shadow-sm group-hover:scale-110 transition-all">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        ) : (
                            formData.length === 0 && (
                                <div className="col-span-2 p-8 text-center border-2 border-dashed border-gray-300 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-900/30 text-gray-500 dark:text-zinc-400 text-sm transition-colors">
                                    No eligibility records added yet.
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Re-using your ProfileField (Keep this in the same file or import it)
function ProfileField({ label, value, isEditing, type = "text", placeholder, onChange, required, disabled, max }: any) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase mb-2">
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
                    max={max}
                    className={`w-full p-2.5 border rounded-lg text-sm transition-all shadow-sm outline-none 
                    ${disabled
                            ? "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 cursor-not-allowed border-gray-200 dark:border-zinc-700"
                            : "bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:ring-1 " +
                            (required && !value
                                ? "border-red-300 dark:border-red-900 focus:border-red-500"
                                : "border-gray-200 dark:border-zinc-700 focus:border-green-500")
                        }`}
                />
            ) : (
                <div className="w-full p-2.5 border border-transparent bg-gray-50 dark:bg-zinc-800/50 rounded-lg text-sm text-gray-800 dark:text-zinc-200 min-h-[42px] flex items-center uppercase">
                    {value || <span className="text-gray-400 dark:text-zinc-500 italic text-xs capitalize">Not set</span>}
                </div>
            )}
        </div>
    );
}