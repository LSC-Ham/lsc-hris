"use client";

import { useState, useEffect } from "react";

export interface AddressData {
    region: string;
    province: string;
    city: string;
    barangay: string;
    house_no: string;
    street: string;
    subdivision: string;
    zip_code: string;
}

interface AddressProps {
    formData: {
        residential: AddressData;
        permanent: AddressData;
    };
    onChange: (updatedData: { residential: AddressData; permanent: AddressData }) => void;
    onSave: () => void;
}

export function Address({ formData, onChange, onSave }: AddressProps) {
    // 1. Separate edit states for each address type
    const [editMode, setEditMode] = useState({
        residential: false,
        permanent: false
    });
    const [isSameAsResidential, setIsSameAsResidential] = useState(false);

    // 2. Draft state remains the same, holding both
    const [draftData, setDraftData] = useState(formData);

    useEffect(() => {
        setDraftData(formData);
    }, [formData]);

    const handleLocalChange = (type: "residential" | "permanent", field: keyof AddressData, value: string) => {
        setDraftData((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
    };

    const handleSameAsResidentialToggle = () => {
        const newValue = !isSameAsResidential;
        setIsSameAsResidential(newValue);

        if (newValue) {
            setDraftData((prev) => ({
                ...prev,
                permanent: { ...prev.residential }
            }));
        }
    };

    // 3. Independent Cancel Actions
    const handleCancel = (type: "residential" | "permanent") => {
        // Revert only the specific address type being cancelled
        setDraftData((prev) => ({
            ...prev,
            [type]: formData[type]
        }));

        setEditMode((prev) => ({ ...prev, [type]: false }));

        if (type === "permanent") {
            setIsSameAsResidential(false);
        }
    };

    // 4. Independent Save Actions
    const handleSaveClick = (type: "residential" | "permanent") => {
        // Push the whole draft up (it contains the newly edited section + the untouched other section)
        onChange(draftData);
        setEditMode((prev) => ({ ...prev, [type]: false }));
        setTimeout(() => onSave(), 0);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="space-y-12">

                {/* =========================================
                    1. RESIDENTIAL ADDRESS SECTION 
                ========================================= */}
                <div>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Residential Address</h2>
                        <button
                            type="button"
                            onClick={() => editMode.residential ? handleCancel("residential") : setEditMode(p => ({ ...p, residential: true }))}
                            className="text-[#1a6b36] text-sm font-medium hover:underline"
                        >
                            {editMode.residential ? "Cancel" : "Edit"}
                        </button>
                    </div>

                    <AddressFormSection
                        data={draftData.residential}
                        isEditing={editMode.residential}
                        onChange={(field, value) => handleLocalChange("residential", field, value)}
                    />

                    {editMode.residential && (
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                className="bg-[#1a6b36] text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all active:scale-95"
                                onClick={() => handleSaveClick("residential")}
                            >
                                Save Residential Address
                            </button>
                        </div>
                    )}
                </div>


                {/* =========================================
                    2. PERMANENT ADDRESS SECTION 
                ========================================= */}
                <div>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Permanent Address</h2>
                            {editMode.permanent && (
                                <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
                                    <input
                                        type="checkbox"
                                        checked={isSameAsResidential}
                                        onChange={handleSameAsResidentialToggle}
                                        className="rounded border-gray-300 text-[#1a6b36] focus:ring-[#1a6b36]"
                                    />
                                    <span>Same as Residential</span>
                                </label>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => editMode.permanent ? handleCancel("permanent") : setEditMode(p => ({ ...p, permanent: true }))}
                            className="text-[#1a6b36] text-sm font-medium hover:underline"
                        >
                            {editMode.permanent ? "Cancel" : "Edit"}
                        </button>
                    </div>

                    <AddressFormSection
                        data={draftData.permanent}
                        isEditing={editMode.permanent}
                        disabled={isSameAsResidential}
                        onChange={(field, value) => handleLocalChange("permanent", field, value)}
                    />

                    {editMode.permanent && (
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                className="bg-[#1a6b36] text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all active:scale-95"
                                onClick={() => handleSaveClick("permanent")}
                            >
                                Save Permanent Address
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
function AddressFormSection({
    data,
    isEditing,
    disabled = false,
    onChange
}: {
    data: AddressData;
    isEditing: boolean;
    disabled?: boolean;
    onChange: (field: keyof AddressData, value: string) => void;
}) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProfileField label="House / Block / Lot No." value={data.house_no} isEditing={isEditing} disabled={disabled} placeholder="Blk 1 Lot 2" onChange={(e: any) => onChange("house_no", e.target.value)} />
                <ProfileField label="Street" value={data.street} isEditing={isEditing} disabled={disabled} placeholder="Mabini St." onChange={(e: any) => onChange("street", e.target.value)} />
                <ProfileField label="Subdivision / Village" value={data.subdivision} isEditing={isEditing} disabled={disabled} placeholder="Greenwoods" onChange={(e: any) => onChange("subdivision", e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField label="Region" value={data.region} isEditing={isEditing} disabled={disabled} placeholder="NCR" required onChange={(e: any) => onChange("region", e.target.value)} />
                <ProfileField label="Province" value={data.province} isEditing={isEditing} disabled={disabled} placeholder="Metro Manila" required onChange={(e: any) => onChange("province", e.target.value)} />

                <ProfileField label="City / Municipality" value={data.city} isEditing={isEditing} disabled={disabled} placeholder="Pasig City" required onChange={(e: any) => onChange("city", e.target.value)} />
                <ProfileField label="Barangay" value={data.barangay} isEditing={isEditing} disabled={disabled} placeholder="San Miguel" required onChange={(e: any) => onChange("barangay", e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProfileField label="Zip Code" value={data.zip_code} isEditing={isEditing} disabled={disabled} placeholder="1600" onChange={(e: any) => onChange("zip_code", e.target.value)} />
            </div>
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