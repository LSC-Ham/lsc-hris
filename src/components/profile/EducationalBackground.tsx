"use client";

import { useState, useEffect } from "react";

const EDUCATIONAL_LEVELS = [
    "Elementary",
    "Secondary",
    "Vocational / Trade Course",
    "College",
    "Graduate Studies"
];

export interface EducationRecord {
    id?: string;
    level: string;
    school: string;
    degree: string;
    date_from: string;
    date_to: string;
    units_earned: string;
    year_graduated: string;
}

interface EducationalBackgroundProps {
    formData?: EducationRecord[];
    onChange: (updatedData: EducationRecord[]) => void;
    onSave?: () => void;
}

const emptyRecord: EducationRecord = {
    level: "",
    school: "",
    degree: "",
    date_from: "",
    date_to: "",
    units_earned: "",
    year_graduated: "",
};

export function EducationalBackground({ formData, onChange, onSave }: EducationalBackgroundProps) {
    // 1. Hold the complete list of records
    const [records, setRecords] = useState<EducationRecord[]>(formData || []);

    // 2. State for the form toggle and draft data
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [draftData, setDraftData] = useState<EducationRecord>(emptyRecord);

    // Keep records synced if parent data updates
    useEffect(() => {
        setRecords(formData || []);
    }, [formData]);

    // --- Local Form Handlers ---
    const handleLocalChange = (field: string, value: any) => {
        setDraftData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddNew = () => {
        setDraftData(emptyRecord);
        setEditingIndex(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (index: number) => {
        setDraftData({ ...records[index] });
        setEditingIndex(index);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (index: number) => {
        if (!window.confirm("Are you sure you want to remove this record?")) return;

        const updatedRecords = [...records];
        updatedRecords.splice(index, 1);

        setRecords(updatedRecords);
        onChange(updatedRecords);
        if (onSave) {
            setTimeout(() => onSave(), 0);
        }
    };

    const handleCancel = () => {
        setDraftData(emptyRecord);
        setEditingIndex(null);
        setIsFormOpen(false);
    };

    const handleSaveClick = () => {
        const updatedRecords = [...records];

        if (editingIndex !== null) {
            // Update existing row
            updatedRecords[editingIndex] = draftData;
        } else {
            // Insert new row (assign a temporary ID for React keys if needed)
            updatedRecords.push({ ...draftData, id: draftData.id || crypto.randomUUID() });
        }

        setRecords(updatedRecords);
        onChange(updatedRecords); // Push entire array up to parent
        setIsFormOpen(false);
        setEditingIndex(null);

        if (onSave) {
            setTimeout(() => onSave(), 0);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Educational Background</h1>

                {!isFormOpen && (
                    <button
                        type="button"
                        onClick={handleAddNew}
                        className="text-[#1a6b36] text-sm font-medium hover:underline flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Record
                    </button>
                )}
            </div>

            {/* FORM VIEW (Shows only when inserting or editing) */}
            {isFormOpen ? (
                <div className="space-y-6 bg-gray-50/50 p-6 border border-gray-100 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            {editingIndex !== null ? "Edit Educational Record" : "New Educational Record"}
                        </h2>
                        <button type="button" onClick={handleCancel} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                            Close
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileSelect label="Level" value={draftData.level} options={EDUCATIONAL_LEVELS} isEditing={true} onChange={(e: any) => handleLocalChange("level", e.target.value)} required />
                        <ProfileField label="School" value={draftData.school} isEditing={true} placeholder="UNIVERSITY OF THE PHILIPPINES" onChange={(e: any) => handleLocalChange("school", e.target.value)} required />
                    </div>

                    <ProfileField label="Degree / Certificate" value={draftData.degree} isEditing={true} placeholder="BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY" onChange={(e: any) => handleLocalChange("degree", e.target.value)} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField label="Date From" value={draftData.date_from} type="date" isEditing={true} onChange={(e: any) => handleLocalChange("date_from", e.target.value)} />
                        <ProfileField label="Date To" value={draftData.date_to} type="date" isEditing={true} onChange={(e: any) => handleLocalChange("date_to", e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField label="Units Earned" value={draftData.units_earned} isEditing={true} placeholder="72 UNITS" onChange={(e: any) => handleLocalChange("units_earned", e.target.value)} />
                        <ProfileField label="Year Graduated" value={draftData.year_graduated} isEditing={true} placeholder="2020" onChange={(e: any) => handleLocalChange("year_graduated", e.target.value)} />
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200 mt-6 gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="bg-[#1a6b36] text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all active:scale-95"
                            onClick={handleSaveClick}
                        >
                            Save Record
                        </button>
                    </div>
                </div>
            ) : (
                /* TABLE VIEW (Shows when not editing) */
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    {records.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No educational background added yet. Click "Add New Record" to begin.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Level</th>
                                        <th className="px-6 py-4 font-semibold">School</th>
                                        <th className="px-6 py-4 font-semibold">Degree / Certificate</th>
                                        <th className="px-6 py-4 font-semibold">Date From</th>
                                        <th className="px-6 py-4 font-semibold">Date To</th>
                                        <th className="px-6 py-4 font-semibold">Units Earned</th>
                                        <th className="px-6 py-4 font-semibold">Year Graduated</th>
                                        <th className="px-6 py-4 font-semibold text-right sticky right-0 bg-gray-50">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {records.map((record, index) => (
                                        <tr key={record.id || index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-gray-800 font-medium">{record.level || "-"}</td>
                                            <td className="px-6 py-4 text-gray-600">{record.school || "-"}</td>
                                            <td className="px-6 py-4 text-gray-600">{record.degree || "-"}</td>
                                            <td className="px-6 py-4 text-gray-600">{record.date_from || "-"}</td>
                                            <td className="px-6 py-4 text-gray-600">{record.date_to || "-"}</td>
                                            <td className="px-6 py-4 text-gray-600">{record.units_earned || "-"}</td>
                                            <td className="px-6 py-4 text-gray-600">{record.year_graduated || "-"}</td>
                                            <td className="px-6 py-4 text-right sticky right-0 bg-white/90 backdrop-blur-sm shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.05)]">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditClick(index)}
                                                        className="text-[#1a6b36] hover:underline font-medium text-xs"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteClick(index)}
                                                        className="text-red-600 hover:underline font-medium text-xs"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// HELPER COMPONENTS (Copied exactly from your ProfileInformation)
// ----------------------------------------------------------------------

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
                    ${type === 'text' ? 'uppercase' : ''} 
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

function ProfileSelect({ label, value, options, isEditing, onChange, required, disabled }: any) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {isEditing ? (
                <div className="relative">
                    <select
                        value={value || ""}
                        onChange={onChange}
                        required={required}
                        disabled={disabled}
                        className={`w-full p-2.5 border rounded-lg text-sm transition-all shadow-sm appearance-none
                        ${disabled
                                ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-white focus:ring-1 outline-none " + (required && !value ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500")
                            }`}
                    >
                        <option value="" disabled>Select {label}</option>
                        {options.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            ) : (
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}