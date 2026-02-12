"use client";

import { useState, ChangeEvent } from "react";

// 1. MAIN COMPONENT (The Container)
// This is now very clean. It just decides WHAT sections to show.
export function Address() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* SECTION 2: Residential Address (New Content!) */}
            <AddressSection
                title="Residential Address"
                initialData={{
                    region: "REGION IV-A",
                    province: "LAGUNA",
                    city: "CITY OF BIÑAN",
                    barangay: "SANTO DOMINGO",
                    house_no: "1561",
                    street: "ZONE 5",
                    subdivision: "",
                    zip_code: "4024",
                }}
            />

            {/* SECTION 1: Permanent Address */}
            <AddressSection
                title="Permanent Address"
                initialData={{
                    region: "REGION IV-A",
                    province: "LAGUNA",
                    city: "CITY OF BIÑAN",
                    barangay: "SANTO DOMINGO",
                    house_no: "1561",
                    street: "ZONE 5",
                    subdivision: "",
                    zip_code: "4024",
                }}
            />
        </div>
    );
}


// 2. SMART SECTION COMPONENT (Handles the Logic)
// This component manages its OWN 'isEditing' state.
// You can use this for 2 addresses or 10 addresses—it doesn't matter.
interface AddressData {
    region: string;
    province: string;
    city: string;
    barangay: string;
    house_no: string;
    street: string;
    subdivision: string;
    zip_code: string;
}

function AddressSection({ title, initialData }: { title: string, initialData: AddressData }) {
    // Each section has its own independent state
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(initialData);

    const handleChange = (field: keyof AddressData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h2>

                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-sm font-medium text-[#1a6b36] hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Edit
                    </button>
                ) : (
                    <div className="border-gray-100 flex justify-end animate-in fade-in ">
                        <button
                            onClick={() => {
                                alert(`Saved changes for ${title}!`);
                                setIsEditing(false);
                            }}
                            className="bg-[#1a6b36] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#155a2b] shadow-sm transition-all"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setFormData(initialData); // Reset on cancel
                            }}
                            className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* FORM GRID */}
            <div className="space-y-6">
                {/* 2 Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Full Width Field */}
                    <AddressField
                        label="Region"
                        value={formData.region}
                        isEditing={isEditing}
                        onChange={(e) => handleChange("region", e.target.value)}
                    />
                    <AddressField
                        label="Province"
                        value={formData.province}
                        isEditing={isEditing}
                        onChange={(e) => handleChange("province", e.target.value)}
                    />
                    <AddressField
                        label="City"
                        value={formData.city}
                        isEditing={isEditing}
                        onChange={(e) => handleChange("city", e.target.value)}
                    />
                    <AddressField
                        label="Barangay"
                        value={formData.barangay}
                        isEditing={isEditing}
                        onChange={(e) => handleChange("barangay", e.target.value)}
                    />
                    <AddressField
                        label="House/Block/Lot No."
                        value={formData.house_no}
                        isEditing={isEditing}
                        onChange={(e) => handleChange("house_no", e.target.value)}
                    />
                    <AddressField
                        label="Street Address"
                        value={formData.street}
                        isEditing={isEditing}
                        onChange={(e) => handleChange("street", e.target.value)}
                    />
                    <AddressField
                        label="Subdivision/Village"
                        value={formData.subdivision}
                        isEditing={isEditing}
                        onChange={(e) => handleChange("subdivision", e.target.value)}
                    />
                    <AddressField
                        label="Zip Code"
                        value={formData.zip_code}
                        isEditing={isEditing}
                        onChange={(e) => handleChange("zip_code", e.target.value)}
                    />

                </div>
            </div>

        </div>
    );
}


// 3. HELPER COMPONENT (The Input Field)
// I renamed this from 'PermanentAddress' to 'AddressField' because it is generic.
interface AddressFieldProps {
    label: string;
    value: string;
    isEditing: boolean;
    type?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function AddressField({ label, value, isEditing, type = "text", onChange }: AddressFieldProps) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                {label}
            </label>

            {isEditing ? (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all shadow-sm"
                />
            ) : (
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}