// src/components/hris/employees/EmploymentDetails.tsx
"use client";

import { useState, useEffect } from "react";

interface EnrollmentDetailsProps {
    mode?: "view" | "update" | "create";
    formData: any;
    divisions?: string[];
    departments?: string[];
    availablePositions?: string[];
    onSave?: (updatedData: any) => void;
    onChange?: (updatedFields: any) => void;
}

export function EnrollmentDetails({
    mode = "view",
    formData,
    onSave,
    onChange
}: EnrollmentDetailsProps) {
    const [isEditing, setIsEditing] = useState(mode === "create");
    const [draftData, setDraftData] = useState<any>({});

    // --- Formatters ---
    const formatDateForInput = (dateVal: any) => {
        if (!dateVal) return "";
        if (typeof dateVal === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(dateVal)) {
            return dateVal.slice(0, 16);
        }
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return "";

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const formatHiredDateView = (dateVal: any) => {
        if (!dateVal) return "";
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return "";
        return d.toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
        });
    };

    const formatDate = (dateString: string | Date) => {
        if (!dateString) return "Present";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', year: 'numeric'
        });
    };

    // --- State Sync ---
    useEffect(() => {
        const initialData = formData || {};

        // Ensure positions are sorted on initial load (Active on top)
        const sortedPositions = [...(initialData.positions || [])].sort((a, b) =>
            (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1)
        );

        setDraftData({
            ...initialData,
            positions: sortedPositions,
            hired_at: formatDateForInput(initialData.hired_at)
        });
    }, [formData]);


    // --- Handlers ---
    const handleLocalChange = (field: string, value: any) => {
        setDraftData((prev: any) => ({ ...prev, [field]: value }));
        if (onChange) {
            onChange({ [field]: value });
        }
    };

    

    const handleSetActivePosition = (indexToActivate: number) => {
        // Map through and set ONLY the target index to true, the rest to false
        let updatedPositions = (draftData.positions || []).map((p: any, i: number) => ({
            ...p,
            is_active: i === indexToActivate
        }));

        // Re-sort to put the active one on top
        updatedPositions.sort((a: any, b: any) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1));

        handleLocalChange("positions", updatedPositions);
    };

    const handleRemovePosition = (indexToRemove: number) => {
        const updatedPositions = (draftData.positions || []).filter((_: any, index: number) => index !== indexToRemove);
        handleLocalChange("positions", updatedPositions);
    };

    // --- Save & Cancel Logic ---
    const handleCancel = () => {
        const initialData = formData || {};
        const sortedPositions = [...(initialData.positions || [])].sort((a, b) =>
            (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1)
        );

        setDraftData({
            ...initialData,
            positions: sortedPositions,
            hired_at: formatDateForInput(initialData.hired_at)
        });
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        if (onSave) {
            onSave(draftData);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Employment Details</h1>

                {mode === "update" && (
                    <button
                        type="button"
                        onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                        className="text-[#1a6b36] text-sm font-medium hover:underline"
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* ID & Dept */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField
                        label="Employee ID Number"
                        value={draftData.id_number}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("id_number", e.target.value)}
                        required
                        disabled={true}
                    />
                </div>
            </div>

            {/* Save Button */}
            {mode !== "create" && isEditing && (
                <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
                    <button
                        type="button"
                        className="bg-[#1a6b36] text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all active:scale-95"
                        onClick={handleSaveClick}
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// HELPER COMPONENTS (Unchanged)
// ----------------------------------------------------------------------

function ProfileField({ label, value, isEditing, type = "text", placeholder, onChange, required, disabled }: any) {
    const displayValue = value instanceof Date ? value.toLocaleDateString() : value;

    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {isEditing ? (
                <input
                    type={type}
                    value={displayValue || ""}
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
                    {displayValue || <span className="text-gray-400 italic">Not set</span>}
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
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center uppercase">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}