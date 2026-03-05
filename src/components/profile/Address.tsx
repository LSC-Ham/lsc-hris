"use client";

import { useState, useEffect, useMemo } from "react";
import {
    listRegions,
    listProvinces,
    listMuncities,
    listBarangays
} from "@jobuntux/psgc";

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
    mode?: "view"
    formData: {
        residential: AddressData;
        permanent: AddressData;
    };
    onSave?: (data: { residential: AddressData; permanent: AddressData }) => void;
}

export function Address({ mode, formData, onSave }: AddressProps) {
    const [editMode, setEditMode] = useState({
        residential: false,
        permanent: false
    });
    const [isSameAsResidential, setIsSameAsResidential] = useState(false);
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

    const handleCancel = (type: "residential" | "permanent") => {
        setDraftData((prev) => ({
            ...prev,
            [type]: formData[type]
        }));
        setEditMode((prev) => ({ ...prev, [type]: false }));
        if (type === "permanent") {
            setIsSameAsResidential(false);
        }
    };

    const handleSaveClick = (type: "residential" | "permanent") => {
        setEditMode((prev) => ({ ...prev, [type]: false }));
        if (onSave) {
            onSave(draftData);
        }
    };

    return (
        <div className="space-y-8 duration-500">
            <div className="space-y-12">

                {/* =========================================
                    1. RESIDENTIAL ADDRESS SECTION 
                ========================================= */}
                <div>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Residential Address</h2>
                        {mode !== "view" && (
                            <button
                                type="button"
                                onClick={() => editMode.residential ? handleCancel("residential") : setEditMode(p => ({ ...p, residential: true }))}
                                className="text-[#1a6b36] text-sm font-medium hover:underline"
                            >
                                {editMode.residential ? "Cancel" : "Edit"}
                            </button>
                        )}
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
                                Save Changes
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
                        {mode !== "view" && (
                            <button
                                type="button"
                                onClick={() => editMode.permanent ? handleCancel("permanent") : setEditMode(p => ({ ...p, permanent: true }))}
                                className="text-[#1a6b36] text-sm font-medium hover:underline"
                            >
                                {editMode.permanent ? "Cancel" : "Edit"}
                            </button>
                        )}
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
    // 1. Map Regions exactly using regCode and regionName
    const regionsRaw = useMemo(() => listRegions() || [], []);
    const regions = useMemo(() => regionsRaw.map((r: any) => ({
        label: r.regionName, value: r.regionName, id: r.regCode
    })), [regionsRaw]);

    const selectedRegionCode = useMemo(() => regions.find(r => r.value === data.region)?.id, [data.region, regions]);

    // 2. Map Provinces using provCode, provName, and cityClass for HUC logic
    const provincesRaw = useMemo(() => selectedRegionCode ? listProvinces(selectedRegionCode) : [], [selectedRegionCode]);
    const provinces = useMemo(() => provincesRaw.map((p: any) => ({
        label: p.provName, value: p.provName, id: p.provCode, isHUC: p.cityClass === 'HUC'
    })), [provincesRaw]);

    const selectedProvObj = useMemo(() => provinces.find(p => p.value === data.province), [data.province, provinces]);
    const selectedProvinceCode = selectedProvObj?.id;
    const isHUC = selectedProvObj?.isHUC;

    // 3. Map Cities using munCityCode and munCityName
    const citiesRaw = useMemo(() => selectedProvinceCode ? listMuncities(selectedProvinceCode) : [], [selectedProvinceCode]);
    const cities = useMemo(() => citiesRaw.map((c: any) => ({
        label: c.munCityName, value: c.munCityName, id: c.munCityCode
    })), [citiesRaw]);

    const selectedCityCode = useMemo(() => cities.find(c => c.value === data.city)?.id, [data.city, cities]);

    // Apply exact HUC logic from the documentation for Barangays
    const effectiveCityCode = isHUC ? (citiesRaw[0]?.munCityCode || selectedCityCode) : selectedCityCode;

    // 4. Map Barangays using brgyCode, brgyName, and brgyOldName
    const barangaysRaw = useMemo(() => effectiveCityCode ? listBarangays(effectiveCityCode) : [], [effectiveCityCode]);
    const barangays = useMemo(() => barangaysRaw.map((b: any) => ({
        label: b.brgyOldName ? `${b.brgyName} (${b.brgyOldName})` : b.brgyName,
        value: b.brgyName,
        id: b.brgyCode
    })), [barangaysRaw]);

    // Handlers to clear downstream data when parents change
    const handleRegionChange = (e: any) => {
        onChange("region", e.target.value);
        onChange("province", "");
        onChange("city", "");
        onChange("barangay", "");
    };

    const handleProvinceChange = (e: any) => {
        onChange("province", e.target.value);
        // If it's an HUC with only 1 city option, auto-select it, otherwise clear it
        const newProvCode = provinces.find(p => p.value === e.target.value)?.id;
        const newCitiesRaw = newProvCode ? listMuncities(newProvCode) : [];
        if (provinces.find(p => p.value === e.target.value)?.isHUC && newCitiesRaw.length === 1) {
            onChange("city", newCitiesRaw[0].munCityName);
        } else {
            onChange("city", "");
        }
        onChange("barangay", "");
    };

    const handleCityChange = (e: any) => {
        onChange("city", e.target.value);
        onChange("barangay", "");
    };

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                    label="Region"
                    value={data.region}
                    isEditing={isEditing}
                    disabled={disabled}
                    required
                    type="select"
                    options={regions}
                    onChange={handleRegionChange}
                />
                <ProfileField
                    label="Province"
                    value={data.province}
                    isEditing={isEditing}
                    disabled={disabled || !data.region}
                    required
                    type="select"
                    options={provinces}
                    onChange={handleProvinceChange}
                />

                <ProfileField
                    label="City / Municipality"
                    value={data.city}
                    isEditing={isEditing}
                    disabled={disabled || !data.province || (isHUC && cities.length === 1)}
                    required
                    type="select"
                    options={cities}
                    onChange={handleCityChange}
                />
                <ProfileField
                    label="Barangay"
                    value={data.barangay}
                    isEditing={isEditing}
                    disabled={disabled || !data.province || (!isHUC && !data.city)}
                    required
                    type="select"
                    options={barangays}
                    onChange={(e: any) => onChange("barangay", e.target.value)}
                />
                <ProfileField label="House / Block / Lot No." value={data.house_no} isEditing={isEditing} disabled={disabled} placeholder="Blk 1 Lot 2" onChange={(e: any) => onChange("house_no", e.target.value)} />
                <ProfileField label="Street" value={data.street} isEditing={isEditing} disabled={disabled} placeholder="Mabini St." onChange={(e: any) => onChange("street", e.target.value)} />
                <ProfileField label="Subdivision / Village" value={data.subdivision} isEditing={isEditing} disabled={disabled} placeholder="Greenwoods" onChange={(e: any) => onChange("subdivision", e.target.value)} />
                <ProfileField label="Zip Code" value={data.zip_code} isEditing={isEditing} disabled={disabled} placeholder="1600" onChange={(e: any) => onChange("zip_code", e.target.value)} />

            </div>
        </div>
    );
}

// Updated ProfileField to handle standard `{ label, value, id }` options
function ProfileField({ label, value, isEditing, type = "text", placeholder, onChange, required, disabled, options = [] }: any) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {isEditing ? (
                type === "select" ? (
                    <select
                        value={value || ""}
                        onChange={onChange}
                        required={required}
                        disabled={disabled}
                        className={`w-full p-2.5 border rounded-lg text-sm transition-all shadow-sm outline-none
                        ${disabled
                                ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-white focus:ring-1 outline-none " + (required && !value ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500")
                            }`}
                    >
                        <option value="" disabled>Select {label}</option>
                        {options.map((opt: any) => (
                            <option key={opt.id} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : (
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
                )
            ) : (
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center uppercase">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}