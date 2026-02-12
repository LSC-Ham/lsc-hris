// src/components/profile/ProfileInformation.tsx
"use client";

import { useState } from "react";

interface PersonalInformationProps {
    mode?: "view" | "create";
    initialData?: any;
    required?: boolean;
}

export function PersonalInformation({ mode = "view", initialData }: PersonalInformationProps) {

    const [isEditing, setIsEditing] = useState(mode === "create");

    const [formData, setFormData] = useState(initialData || {
        firstname: "",
        surname: "",
        middlename: "",
        extension: "",
        birthdate: "",
        birthplace: "",
        sex: "",
        civil_status: "",
        telephone_no: "",
        mobile_no: "",
        email: "",
        nationality: "",
        height: "",
        weight: "",
        blood_type: "",
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    // NEW: Handle the form submission
    const handleSubmit = (e: any) => {
        e.preventDefault(); // Stop page reload

        // If the code reaches here, all 'required' fields are filled.
        console.log("Form submitted successfully:", formData);
        setIsEditing(false);
    };

    return (
        // CHANGE 1: Main wrapper is now a <form> with an onSubmit handler
        <form
            onSubmit={handleSubmit}
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                    {mode === "create" ? "Personal Information" : "Personal Information"}
                </h1>

                {mode !== "create" && (
                    <>
                        {!isEditing ? (
                            <button
                                type="button" // Important: type="button" prevents accidental submit
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 text-sm font-medium text-[#1a6b36] hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit
                            </button>
                        ) : (
                            <button
                                type="button" // Important: type="button" prevents accidental submit
                                onClick={() => setIsEditing(false)}
                                className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5"
                            >
                                Cancel
                            </button>
                        )}
                    </>
                )}
            </div>

            <div className="space-y-6">
                <ProfileField
                    label="Surname"
                    value={formData.surname}
                    isEditing={isEditing}
                    placeholder="Dela Cruz"
                    onChange={(e: any) => handleChange("surname", e.target.value)}
                    required // This triggers validation now
                />
                <ProfileField
                    label="First Name"
                    value={formData.firstname}
                    isEditing={isEditing}
                    placeholder="Juan"
                    onChange={(e: any) => handleChange("firstname", e.target.value)}
                    required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <ProfileField
                        label="Middle Name"
                        value={formData.middlename}
                        isEditing={isEditing}
                        placeholder="Santos"
                        onChange={(e: any) => handleChange("middlename", e.target.value)}
                    />
                    <ProfileField
                        label="Extension"
                        value={formData.extension}
                        isEditing={isEditing}
                        placeholder="Jr."
                        onChange={(e: any) => handleChange("extension", e.target.value)}
                    />
                    <ProfileField
                        label="Date of Birth"
                        value={formData.birthdate}
                        type="date"
                        isEditing={isEditing}
                        placeholder="2/12/2026"
                        onChange={(e: any) => handleChange("birthdate", e.target.value)}
                    />
                    <ProfileField
                        label="Place of Birth"
                        value={formData.birthplace}
                        isEditing={isEditing}
                        onChange={(e: any) => handleChange("birthplace", e.target.value)}
                        placeholder="City of Bukawkaw"
                    />
                    <ProfileField
                        label="Sex"
                        value={formData.sex}
                        isEditing={isEditing}
                        placeholder="Sex"
                        onChange={(e: any) => handleChange("sex", e.target.value)}
                        required
                    />
                    <ProfileField
                        label="Civil Status"
                        value={formData.civil_status}
                        isEditing={isEditing}
                        placeholder="Single"
                        onChange={(e: any) => handleChange("civil_status", e.target.value)}
                        required
                    />
                    <ProfileField
                        label="Telephone No."
                        value={formData.telephone_no}
                        isEditing={isEditing}
                        onChange={(e: any) => handleChange("telephone_no", e.target.value)}
                        placeholder="0909-XXX-XXXX"
                    />
                    <ProfileField
                        label="Mobile No."
                        value={formData.mobile_no}
                        isEditing={isEditing}
                        placeholder="0999-XXX-XXXX"
                        onChange={(e: any) => handleChange("mobile_no", e.target.value)}
                    />
                </div>
                <ProfileField
                    label="Email Address"
                    value={formData.email}
                    isEditing={isEditing}
                    placeholder="jdelacruz@lakeshore.edu.ph"
                    onChange={(e: any) => handleChange("email", e.target.value)}
                />
                <ProfileField
                    label="Nationality"
                    value={formData.nationality}
                    isEditing={isEditing}
                    placeholder="Philippines"
                    onChange={(e: any) => handleChange("nationality", e.target.value)}
                    required
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProfileField
                        label="Height"
                        value={formData.height}
                        isEditing={isEditing}
                        placeholder="179m"
                        onChange={(e: any) => handleChange("height", e.target.value)}
                    />
                    <ProfileField
                        label="Weight"
                        value={formData.weight}
                        isEditing={isEditing}
                        placeholder="80kg"
                        onChange={(e: any) => handleChange("weight", e.target.value)}
                    />
                    <ProfileField
                        label="Blood Type"
                        value={formData.blood_type}
                        isEditing={isEditing}
                        placeholder="O+"
                        onChange={(e: any) => handleChange("blood_type", e.target.value)}
                    />
                </div>
            </div>

            {/* Actions for both modes */}
            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                {mode === "create" ? (
                    <></>
                ) : isEditing && (
                    <button
                        // CHANGE 2: This is now type="submit". The onClick is removed.
                        type="submit"
                        className="bg-[#1a6b36] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#155a2b] transition-all"
                    >
                        Save Changes
                    </button>
                )}
            </div>
        </form>
    );
}

// --- HELPER COMPONENT ---
// CHANGE 3: Added 'required' to destructuring and to the input
function ProfileField({ label, value, isEditing, type = "text", placeholder, onChange, required }: any) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                {label}
                {/* Visual indicator for required fields */}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {isEditing ? (
                // EDIT MODE: Input
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    required={required}
                    className={`w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-1 outline-none transition-all shadow-sm
                    ${required && !value ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-green-500 focus:ring-green-500"}
                    `}
                />
            ) : (
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}