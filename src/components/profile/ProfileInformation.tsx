"use client";

import { useState } from "react";

export function PersonalInformation() {
    // 1. STATE: specific to this form
    const [isEditing, setIsEditing] = useState(false);

    // 2. DATA: In a real app, this comes from your database
    const [formData, setFormData] = useState({
        firstname: "JUAN",
        surname: "DELA CRUZ",
        middlename: "SANTOS",
        extension: "JR.",
        birthdate: "1990-01-01",
        birthplace: "CITY OF BUKAWKAW",
        sex: "MALE",
        civil_status: "MARRIED",
        telephone_no: "0999-XXX-XXXX",
        mobile_no: "0999-XXX-XXXX",
        email: "juandelacruz@gmail.com",
        nationality: "Philippines",
        height: "",
        weight: "",
        blood_type: "",
    });

    // Helper to update state when typing
    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* HEADER: Title + Toggle Button */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Personal Information</h1>
                {/* The Toggle Logic */}
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-sm font-medium text-[#1a6b36] hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* FORM GRID */}
            <div className="space-y-6">
                <ProfileField
                    label="Last Name"
                    value={formData.surname}
                    isEditing={isEditing}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("surname", e.target.value)}
                />
                <ProfileField
                    label="First Name"
                    value={formData.firstname}
                    isEditing={isEditing}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("firstname", e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField
                        label="Middle Name"
                        value={formData.middlename}
                        isEditing={isEditing}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("middlename", e.target.value)}
                    />
                    <ProfileField
                        label="Extension"
                        value={formData.extension}
                        isEditing={isEditing}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("extension", e.target.value)}
                    />

                    <ProfileField
                        label="Date of Birth"
                        value={formData.birthdate}
                        type="date"
                        isEditing={isEditing}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("birthdate", e.target.value)}
                    />
                    <ProfileField
                        label="Place of Birth"
                        value={formData.birthplace}
                        isEditing={isEditing}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("birthplace", e.target.value)}
                    />
                    <ProfileField
                        label="Telephone No."
                        value={formData.telephone_no}
                        isEditing={isEditing}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("telephone_no", e.target.value)}
                    />
                    <ProfileField
                        label="Mobile No."
                        value={formData.mobile_no}
                        isEditing={isEditing}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("mobile_no", e.target.value)}
                    />
                </div>
                <ProfileField
                    label="Email Address (if any)"
                    value={formData.email}
                    isEditing={isEditing}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
                />
            </div>

            {/* FOOTER ACTIONS (Only visible when editing) */}
            {isEditing && (
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            alert("Saved!"); // Replace with real save logic
                            setIsEditing(false);
                        }}
                        className="bg-[#1a6b36] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#155a2b] shadow-sm transition-all"
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
}


// --- HELPER COMPONENT ---
// Put this at the bottom of the same file, or in a separate file if you use it a lot.
function ProfileField({ label, value, isEditing, type = "text", onChange }: any) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                {label}
            </label>

            {isEditing ? (
                // EDIT MODE: Input
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all shadow-sm"
                />
            ) : (
                // VIEW MODE: Static Text
                // We use a div that looks slightly like an input so the layout doesn't jump
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800">
                    {value || "-"}
                </div>
            )}
        </div>
    );
}