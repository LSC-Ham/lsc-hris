"use client";

import { useState } from "react";

export interface WorkExperienceRecord {
    id?: string;
    date_from: string;
    date_to: string;
    position_title: string;
    company: string;
    monthly_salary: string;
    appointment_status: string;
    gov_service: boolean;
}

interface WorkExperienceProps {
    mode?: "view",
    formData: WorkExperienceRecord[];
    onSave?: (updatedData: WorkExperienceRecord[]) => Promise<void>;
}

const emptyRecord: WorkExperienceRecord = {
    date_from: "",
    date_to: "",
    position_title: "",
    company: "",
    monthly_salary: "",
    appointment_status: "",
    gov_service: false,
};

export function WorkExperience({ mode, formData = [], onSave }: WorkExperienceProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [draftData, setDraftData] = useState<WorkExperienceRecord>(emptyRecord);
    const [isSaving, setIsSaving] = useState(false);

    const handleLocalChange = (field: keyof WorkExperienceRecord, value: any) => {
        setDraftData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddNew = () => {
        setDraftData(emptyRecord);
        setEditingIndex(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (index: number) => {
        const record = formData[index];
        setDraftData({ ...record });
        setEditingIndex(index);
        setIsFormOpen(true);
    };

    const handleDeleteClick = async (index: number) => {
        if (!window.confirm("Are you sure you want to remove this work experience record?")) return;
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
        if (!draftData.position_title || !draftData.company) {
            alert("Please fill in the required fields: Position Title and Company.");
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
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Work Experience</h1>
                {mode !== "view" && !isFormOpen && (
                    <button
                        type="button"
                        onClick={handleAddNew}
                        className="text-[#1a6b36] text-sm font-medium hover:underline flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Work Experience
                    </button>
                )}
            </div>

            {/* FORM VIEW */}
            {isFormOpen ? (
                <div className="space-y-6 bg-gray-50/50 p-6 border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            {editingIndex !== null ? "Edit Work Experience" : "New Work Experience"}
                        </h2>
                        <button type="button" onClick={handleCancel} disabled={isSaving} className="text-gray-500 hover:text-gray-700 text-sm font-medium disabled:opacity-50">
                            Close
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField
                            label="Position Title"
                            value={draftData.position_title}
                            isEditing={true}
                            placeholder="SOFTWARE ENGINEER"
                            onChange={(e: any) => handleLocalChange("position_title", e.target.value)}
                            required
                        />
                        <ProfileField
                            label="Company / Office"
                            value={draftData.company}
                            isEditing={true}
                            placeholder="TECH SOLUTIONS INC."
                            onChange={(e: any) => handleLocalChange("company", e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField
                            label="Date From"
                            value={draftData.date_from}
                            type="date"
                            isEditing={true}
                            onChange={(e: any) => handleLocalChange("date_from", e.target.value)}
                        />
                        <ProfileField
                            label="Date To"
                            value={draftData.date_to}
                            type="date"
                            isEditing={true}
                            onChange={(e: any) => handleLocalChange("date_to", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ProfileField
                            label="Monthly Salary"
                            value={draftData.monthly_salary}
                            isEditing={true}
                            type="number"
                            placeholder="50000"
                            onChange={(e: any) => handleLocalChange("monthly_salary", e.target.value)}
                        />
                        <ProfileField
                            label="Status of Appointment"
                            value={draftData.appointment_status}
                            isEditing={true}
                            placeholder="REGULAR"
                            onChange={(e: any) => handleLocalChange("appointment_status", e.target.value)}
                        />
                        <div className="flex flex-col justify-center">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                Gov't Service?
                            </label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={draftData.gov_service === true}
                                        onChange={() => handleLocalChange("gov_service", true)}
                                        className="w-4 h-4 accent-[#1a6b36]"
                                    />
                                    <span className="text-sm">Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={draftData.gov_service === false}
                                        onChange={() => handleLocalChange("gov_service", false)}
                                        className="w-4 h-4 accent-[#1a6b36]"
                                    />
                                    <span className="text-sm">No</span>
                                </label>
                            </div>
                        </div>
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
                            No work experience added yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {formData.map((record, index) => (
                                <div
                                    key={record.id || index}
                                    className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider bg-gray-100 text-gray-600`}>
                                            {record.gov_service ? 'Public' : 'Private'}
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
                                            {record.position_title || "Unknown Position"}
                                        </h3>
                                        <p className="text-sm text-gray-600 font-medium uppercase italic">
                                            {record.company || "No Company Provided"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs mt-auto pt-4 border-t border-gray-100">
                                        <div>
                                            <span className="block text-gray-400 font-medium uppercase mb-0.5">Date From</span>
                                            <span className="text-gray-800 font-semibold">{record.date_from || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 font-medium uppercase mb-0.5">Date To</span>
                                            <span className="text-gray-800 font-semibold">{record.date_to || "PRESENT"}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 font-medium uppercase mb-0.5">Monthly Salary</span>
                                            <span className="text-gray-800 font-semibold">{record.monthly_salary ? `₱${parseInt(record.monthly_salary).toLocaleString()}` : "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 font-medium uppercase mb-0.5">Status</span>
                                            <span className="text-gray-800 font-semibold uppercase">{record.appointment_status || "N/A"}</span>
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
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center uppercase">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}