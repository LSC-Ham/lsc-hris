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
    // 1. Removed onChange, updated onSave to accept the full payload
    onSave?: (data: { guardian: FamilyMemberData; father: FamilyMemberData; mother: FamilyMemberData }) => void;
}

export function FamilyBackground({ formData, onSave, mode }: FamilyBackgroundProps) {
    // Separate edit states for each family member type
    const [editMode, setEditMode] = useState({
        guardian: false,
        father: false,
        mother: false
    });

    // Local draft state
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
        // Revert only the specific family member being cancelled
        setDraftData((prev) => ({
            ...prev,
            [type]: formData[type]
        }));
        setEditMode((prev) => ({ ...prev, [type]: false }));
    };

    // 2. Updated Save Action to pass draftData directly
    const handleSaveClick = (type: "guardian" | "father" | "mother") => {
        setEditMode((prev) => ({ ...prev, [type]: false }));
        // Pass the whole draft up to the parent
        if (onSave) {
            onSave(draftData);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-12">

                {/* =========================================
                    1. GUARDIAN'S INFORMATION 
                ========================================= */}
                <div>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Guardian&apos;s Information</h2>
                        {mode !== "view" && (
                            <button
                                type="button"
                                onClick={() => editMode.guardian ? handleCancel("guardian") : setEditMode(p => ({ ...p, guardian: true }))}
                                className="text-[#1a6b36] text-sm font-medium hover:underline"
                            >
                                {editMode.guardian ? "Cancel" : "Edit"}
                            </button>
                        )}
                    </div>

                    <FamilyFormSection
                        data={draftData.guardian}
                        isEditing={editMode.guardian}
                        onChange={(field, value) => handleLocalChange("guardian", field, value)}
                    />

                    {editMode.guardian && (
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                className="bg-[#1a6b36] text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all active:scale-95"
                                onClick={() => handleSaveClick("guardian")}
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
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Father&apos;s Information</h2>
                        <button
                            type="button"
                            onClick={() => editMode.father ? handleCancel("father") : setEditMode(p => ({ ...p, father: true }))}
                            className="text-[#1a6b36] text-sm font-medium hover:underline"
                        >
                            {editMode.father ? "Cancel" : "Edit"}
                        </button>
                    </div>

                    <FamilyFormSection
                        data={draftData.father}
                        isEditing={editMode.father}
                        onChange={(field, value) => handleLocalChange("father", field, value)}
                    />

                    {editMode.father && (
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                className="bg-[#1a6b36] text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all active:scale-95"
                                onClick={() => handleSaveClick("father")}
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
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Mother&apos;s Information</h2>
                        <button
                            type="button"
                            onClick={() => editMode.mother ? handleCancel("mother") : setEditMode(p => ({ ...p, mother: true }))}
                            className="text-[#1a6b36] text-sm font-medium hover:underline"
                        >
                            {editMode.mother ? "Cancel" : "Edit"}
                        </button>
                    </div>

                    <FamilyFormSection
                        data={draftData.mother}
                        isEditing={editMode.mother}
                        customSurnameLabel="Maiden Surname"
                        onChange={(field, value) => handleLocalChange("mother", field, value)}
                    />

                    {editMode.mother && (
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                className="bg-[#1a6b36] text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all active:scale-95"
                                onClick={() => handleSaveClick("mother")}
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

// ----------------------------------------------------------------------
// INTERNAL HELPER COMPONENTS
// ----------------------------------------------------------------------
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
                    value={data.contact_no} // FIX: Changed from data.employer to data.contact_no
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
        <div className="uppercase">
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
                    ${disabled
                            ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-white focus:ring-1 outline-none " + (required && !value ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500")
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