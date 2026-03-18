"use client";

import { useState, useEffect } from "react";

export interface FamilyMemberData {
    surname: string;
    firstname: string;
    middlename: string;
    extension: string;
    occupation: string;
    employer: string;
    occupation_address: string;
    contact_no: string;
}

interface FamilyBackgroundProps {
    mode?: "view",
    formData: {
        guardian: FamilyMemberData;
        father: FamilyMemberData;
        mother: FamilyMemberData;
    };
    onSave?: (data: { guardian: FamilyMemberData; father: FamilyMemberData; mother: FamilyMemberData }) => void;
}

export function FamilyBackground({ formData, onSave, mode }: FamilyBackgroundProps) {
    const [editMode, setEditMode] = useState({
        guardian: false,
        father: false,
        mother: false
    });

    const [draftData, setDraftData] = useState(formData);

    useEffect(() => {
        setDraftData(formData);
    }, [formData]);

    const handleLocalChange = (type: "guardian" | "father" | "mother", field: keyof FamilyMemberData, value: string) => {
        setDraftData((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
    };

    const handleCancel = (type: "guardian" | "father" | "mother") => {
        setDraftData((prev) => ({
            ...prev,
            [type]: formData[type]
        }));
        setEditMode((prev) => ({ ...prev, [type]: false }));
    };

    const handleSaveClick = (type: "guardian" | "father" | "mother") => {
        setEditMode((prev) => ({ ...prev, [type]: false }));
        if (onSave) {
            onSave(draftData);
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-12">

                {/* =========================================
                    1. GUARDIAN'S INFORMATION 
                ========================================= */}
                <div>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Guardian&apos;s Information</h2>
                        {mode !== "view" && (
                            <button
                                type="button"
                                onClick={() => editMode.guardian ? handleCancel("guardian") : setEditMode(p => ({ ...p, guardian: true }))}
                                className="text-[#1a6b36] dark:text-green-500 text-sm font-medium hover:underline"
                            >
                                {editMode.guardian ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                )}
                            </button>


                        )}
                    </div>

                    <FamilyFormSection
                        data={draftData.guardian}
                        isEditing={editMode.guardian}
                        onChange={(field, value) => handleLocalChange("guardian", field, value)}
                    />

                    {editMode.guardian && (
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800 mt-6">
                            <button
                                type="button"
                                onClick={() => handleCancel("guardian")}
                                className="cursor-pointer px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg transition-all"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSaveClick("guardian")}
                                className="cursor-pointer bg-brand hover:bg-brand-dark text-white font-medium text-sm px-8 py-2.5 rounded-lg shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* =========================================
                    2. FATHER'S INFORMATION 
                ========================================= */}
                <div>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Father&apos;s Information</h2>
                        {mode !== "view" && (
                            <button
                                type="button"
                                onClick={() => editMode.father ? handleCancel("father") : setEditMode(p => ({ ...p, father: true }))}
                                className="text-[#1a6b36] dark:text-green-500 text-sm font-medium hover:underline"
                            >
                                {editMode.father ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>

                    <FamilyFormSection
                        data={draftData.father}
                        isEditing={editMode.father}
                        onChange={(field, value) => handleLocalChange("father", field, value)}
                    />

                    {editMode.father && (
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800 mt-6">
                            <button
                                type="button"
                                onClick={() => handleCancel("father")}
                                className="cursor-pointer px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg transition-all"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSaveClick("father")}
                                className="cursor-pointer bg-brand hover:bg-brand-dark text-white font-medium text-sm px-8 py-2.5 rounded-lg shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* =========================================
                    3. MOTHER'S INFORMATION 
                ========================================= */}
                <div>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Mother&apos;s Information</h2>
                        {mode !== "view" && (
                            <button
                                type="button"
                                onClick={() => editMode.mother ? handleCancel("mother") : setEditMode(p => ({ ...p, mother: true }))}
                                className="text-[#1a6b36] dark:text-green-500 text-sm font-medium hover:underline"
                            >
                                {editMode.mother ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>

                    <FamilyFormSection
                        data={draftData.mother}
                        isEditing={editMode.mother}
                        customSurnameLabel="Maiden Surname"
                        onChange={(field, value) => handleLocalChange("mother", field, value)}
                    />

                    {editMode.mother && (
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800 mt-6">
                            <button
                                type="button"
                                onClick={() => handleCancel("mother")}
                                className="cursor-pointer px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg transition-all"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSaveClick("mother")}
                                className="cursor-pointer bg-brand hover:bg-brand-dark text-white font-medium text-sm px-8 py-2.5 rounded-lg shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

function FamilyFormSection({
    data,
    isEditing,
    customSurnameLabel = "Surname",
    onChange
}: {
    data: FamilyMemberData;
    isEditing: boolean;
    customSurnameLabel?: string;
    onChange: (field: keyof FamilyMemberData, value: string) => void;
}) {
    return (
        <div className="space-y-6">
            <ProfileField
                label={customSurnameLabel}
                value={data.surname}
                isEditing={isEditing}
                placeholder="Dela Cruz"
                onChange={(e: any) => onChange("surname", e.target.value)}
            />
            <ProfileField
                label="First Name"
                value={data.firstname}
                isEditing={isEditing}
                placeholder="Juan"
                onChange={(e: any) => onChange("firstname", e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <ProfileField
                    label="Middle Name"
                    value={data.middlename}
                    isEditing={isEditing}
                    placeholder="Rizal"
                    onChange={(e: any) => onChange("middlename", e.target.value)}
                />
                <ProfileField
                    label="Name Extension"
                    value={data.extension}
                    isEditing={isEditing}
                    placeholder="Jr., Sr., III (Optional)"
                    onChange={(e: any) => onChange("extension", e.target.value)}
                />
                <ProfileField
                    label="Occupation"
                    value={data.occupation}
                    isEditing={isEditing}
                    placeholder="HR Officer"
                    onChange={(e: any) => onChange("occupation", e.target.value)}
                />
                <ProfileField
                    label="Employer/Business Name"
                    value={data.employer}
                    isEditing={isEditing}
                    placeholder="Dr. Juan Dela Cruz"
                    onChange={(e: any) => onChange("employer", e.target.value)}
                />
                <ProfileField
                    label="Business Address"
                    value={data.occupation_address}
                    isEditing={isEditing}
                    placeholder="San Juan St."
                    onChange={(e: any) => onChange("occupation_address", e.target.value)}
                />
                <ProfileField
                    label="Contact No."
                    value={data.contact_no}
                    isEditing={isEditing}
                    placeholder="09XX-XXX-XXXX"
                    onChange={(e: any) => onChange("contact_no", e.target.value)}
                />
            </div>
        </div>
    );
}

function ProfileField({ label, value, isEditing, type = "text", placeholder, onChange, required, disabled }: any) {
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