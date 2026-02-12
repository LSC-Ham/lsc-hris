"use client";

import { useState } from "react";

interface PersonalInformationProps {
    mode?: "view" | "create";
    formData: any;        // RECEIVED FROM PARENT
    onChange: (field: string, value: any) => void; // RECEIVED FROM PARENT
}

export function PersonalInformation({ mode = "view", formData, onChange }: PersonalInformationProps) {

    const [isEditing, setIsEditing] = useState(mode === "create");

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Personal Information</h1>

                {/* View/Edit toggle logic (only for view mode) */}
                {mode !== "create" && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-[#1a6b36] text-sm font-medium"
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                )}
            </div>

            <div className="space-y-6">
                <ProfileField
                    label="Surname"
                    value={formData.surname}
                    isEditing={isEditing}
                    placeholder="Dela Cruz"
                    onChange={(e: any) => onChange("surname", e.target.value)}
                    required
                />
                <ProfileField
                    label="First Name"
                    value={formData.firstname}
                    isEditing={isEditing}
                    placeholder="Juan"
                    onChange={(e: any) => onChange("firstname", e.target.value)}
                    required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField label="Middle Name" value={formData.middlename} isEditing={isEditing} placeholder="Santos" onChange={(e: any) => onChange("middlename", e.target.value)} />
                    <ProfileField label="Extension" value={formData.extension} isEditing={isEditing} placeholder="Jr." onChange={(e: any) => onChange("extension", e.target.value)} />
                    <ProfileField label="Date of Birth" value={formData.birthdate} type="date" isEditing={isEditing} onChange={(e: any) => onChange("birthdate", e.target.value)} />
                    <ProfileField label="Place of Birth" value={formData.birthplace} isEditing={isEditing} placeholder="City" onChange={(e: any) => onChange("birthplace", e.target.value)} />
                    <ProfileField label="Sex" value={formData.sex} isEditing={isEditing} placeholder="Sex" onChange={(e: any) => onChange("sex", e.target.value)} required />
                    <ProfileField label="Civil Status" value={formData.civil_status} isEditing={isEditing} placeholder="Single" onChange={(e: any) => onChange("civil_status", e.target.value)} required />
                    <ProfileField label="Telephone No." value={formData.telephone_no} isEditing={isEditing} placeholder="0909-XXX-XXXX" onChange={(e: any) => onChange("telephone_no", e.target.value)} />
                    <ProfileField label="Mobile No." value={formData.mobile_no} isEditing={isEditing} placeholder="0999-XXX-XXXX" onChange={(e: any) => onChange("mobile_no", e.target.value)} />
                </div>
                <ProfileField label="Email Address" value={formData.email} isEditing={isEditing} placeholder="jdelacruz@lakeshore.edu.ph" onChange={(e: any) => onChange("email", e.target.value)} />
                <ProfileField label="Nationality" value={formData.nationality} isEditing={isEditing} placeholder="Philippines" onChange={(e: any) => onChange("nationality", e.target.value)} required />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProfileField label="Height" value={formData.height} isEditing={isEditing} placeholder="179m" onChange={(e: any) => onChange("height", e.target.value)} />
                    <ProfileField label="Weight" value={formData.weight} isEditing={isEditing} placeholder="80kg" onChange={(e: any) => onChange("weight", e.target.value)} />
                    <ProfileField label="Blood Type" value={formData.blood_type} isEditing={isEditing} placeholder="O+" onChange={(e: any) => onChange("blood_type", e.target.value)} />
                </div>
            </div>
        </div>
    );
}

// Helper (You can import the same Helper from EmploymentDetails or define it again here)
function ProfileField({ label, value, isEditing, type = "text", placeholder, onChange, required }: any) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {isEditing ? (
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    required={required}
                    className={`w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-1 outline-none transition-all shadow-sm
                    ${required && !value ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
            ) : (
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}