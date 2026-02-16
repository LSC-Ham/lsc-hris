"use client";

import { useState, useEffect } from "react";

const CIVIL_STATUS = ["Single", "Married", "Divorced", "Widowed", "Separated", "Domestic Partnership", "Civil Union"];
const SEX = ["Male", "Female", "Non-binary", "Other/Prefer not to say"];

interface PersonalInformationProps {
    mode?: "view" | "create";
    formData: any;
    onChange: (field: string, value: any) => void;
    onSave: () => void; // 👈 Add this line
}

export function PersonalInformation({ mode = "view", formData, onChange, onSave }: PersonalInformationProps) {
    const [isEditing, setIsEditing] = useState(mode === "create");
    const [cityOptions, setCityOptions] = useState<string[]>([]);
    const [nationalityOptions, setNationalityOptions] = useState<string[]>([]);
    const [isLoadingCities, setIsLoadingCities] = useState(true);
    const [isLoadingNationalities, setIsLoadingNationalities] = useState(true);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch("https://psgc.gitlab.io/api/cities/");
                const data = await response.json();
                const cityNames = data.map((city: any) => city.name);
                const uniqueCities = Array.from(new Set(cityNames));
                const sortedNames = (uniqueCities as string[]).sort((a, b) => a.localeCompare(b));
                setCityOptions(sortedNames);
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            } finally {
                setIsLoadingCities(false);
            }
        };
        fetchCities();
    }, []);

    // --- Fetch Nationalities (with Flags) ---
    useEffect(() => {
        const fetchNationalities = async () => {
            try {
                const response = await fetch("https://countriesnow.space/api/v0.1/countries/flag/unicode");
                const result = await response.json();

                // 1. Sort the raw data by the 'name' property
                const sortedData = result.data.sort((a: any, b: any) =>
                    a.name.localeCompare(b.name)
                );

                // 2. Now map the sorted data to include the flag
                const formattedCountries = sortedData.map((country: any) =>
                    `${country.name}`
                );

                setNationalityOptions(formattedCountries);
            } catch (error) {
                console.error("Failed to fetch nationalities:", error);
            } finally {
                setIsLoadingNationalities(false);
            }
        };
        fetchNationalities();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Personal Information</h1>

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

            {/* Form Fields */}
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

                    {/* Place of Birth */}
                    {isLoadingCities ? (
                        <LoadingPlaceholder label="Place of Birth" />
                    ) : (
                        <ProfileSelect
                            label="Place of Birth"
                            value={formData.birthplace}
                            options={cityOptions}
                            isEditing={isEditing}
                            onChange={(e: any) => onChange("birthplace", e.target.value)}
                        />
                    )}

                    {/* Sex Dropdown */}
                    <ProfileSelect
                        label="Sex"
                        value={formData.sex}
                        options={SEX}
                        isEditing={isEditing}
                        onChange={(e: any) => onChange("sex", e.target.value)}
                        required
                    />

                    {/* Civil Status Dropdown */}
                    <ProfileSelect
                        label="Civil Status"
                        value={formData.civil_status}
                        options={CIVIL_STATUS}
                        isEditing={isEditing}
                        onChange={(e: any) => onChange("civil_status", e.target.value)}
                        required
                    />

                    <ProfileField label="Telephone No." value={formData.telephone_no} isEditing={isEditing} placeholder="0909-XXX-XXXX" onChange={(e: any) => onChange("telephone_no", e.target.value)} />
                    <ProfileField label="Mobile No." value={formData.mobile_no} isEditing={isEditing} placeholder="0999-XXX-XXXX" onChange={(e: any) => onChange("mobile_no", e.target.value)} />
                </div>

                <ProfileField label="Personal Email Address" value={formData.email} isEditing={isEditing} placeholder="jdelacruz@lakeshore.edu.ph" onChange={(e: any) => onChange("email", e.target.value)} />

                {/* Nationality with Flag API */}
                {isLoadingNationalities ? (
                    <LoadingPlaceholder label="Nationality" />
                ) : (
                    <ProfileSelect
                        label="Nationality"
                        value={formData.nationality}
                        options={nationalityOptions}
                        isEditing={isEditing}
                        onChange={(e: any) => onChange("nationality", e.target.value)}
                        required
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProfileField label="Height" value={formData.height} isEditing={isEditing} placeholder="1.79m" onChange={(e: any) => onChange("height", e.target.value)} />
                    <ProfileField label="Weight" value={formData.weight} isEditing={isEditing} placeholder="80kg" onChange={(e: any) => onChange("weight", e.target.value)} />
                    <ProfileField label="Blood Type" value={formData.blood_type} isEditing={isEditing} placeholder="O+" onChange={(e: any) => onChange("blood_type", e.target.value)} />
                </div>
            </div>

            {/* Save Button */}
            {mode !== "create" && isEditing && (
                <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
                    <button
                        type="button"
                        className="bg-[#1a6b36] text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all active:scale-95"
                        onClick={() => {
                            onSave(); // Tell the parent to save to the DB
                            setIsEditing(false); // Switch back to "view" mode
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
}

// --- Internal Helper for Loading States ---
function LoadingPlaceholder({ label }: { label: string }) {
    return (
        <div className="w-full">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">{label}</label>
            <div className="w-full p-2.5 border border-gray-100 bg-gray-50 rounded-lg text-xs text-gray-400 animate-pulse">
                Loading options...
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// HELPER COMPONENTS (ProfileField and ProfileSelect remain the same)
// ----------------------------------------------------------------------

function ProfileField({ label, value, isEditing, type = "text", placeholder, onChange, required, disabled }: any) {
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
                    disabled={disabled}
                    className={`w-full p-2.5 border rounded-lg text-sm transition-all shadow-sm outline-none
                    ${disabled
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                            : "bg-white focus:ring-1 " + (required && !value ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500")
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

function ProfileSelect({ label, value, options, isEditing, onChange, required, disabled }: any) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {isEditing ? (
                <div className="relative">
                    <select
                        value={value}
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
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}