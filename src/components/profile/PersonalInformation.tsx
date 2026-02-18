"use client";

import { useState, useEffect } from "react";

const CIVIL_STATUS = ["Single", "Married", "Divorced", "Widowed", "Separated", "Domestic Partnership", "Civil Union"];
const SEX = ["Male", "Female", "Non-binary", "Other/Prefer not to say"];

interface PersonalInformationProps {
    mode?: "view" | "create";
    formData: any;
    onChange: (field: string, value: any) => void;
    onSave?: (data: any) => void; // <--- CHANGE THIS LINE
}

export function PersonalInformation({ mode = "view", formData, onChange, onSave }: PersonalInformationProps) {
    const [isEditing, setIsEditing] = useState(mode === "create");

    // 1. Create a local draft to hold typed text safely
    const [draftData, setDraftData] = useState(formData);

    const [cityOptions, setCityOptions] = useState<string[]>([]);
    const [nationalityOptions, setNationalityOptions] = useState<string[]>([]);
    const [isLoadingCities, setIsLoadingCities] = useState(true);
    const [isLoadingNationalities, setIsLoadingNationalities] = useState(true);

    // 2. Keep the draft fresh if parent data updates
    useEffect(() => {
        setDraftData(formData);
    }, [formData]);

    // 3. Local handler: updates the draft, NOT the parent
    const handleLocalChange = (field: string, value: any) => {
        setDraftData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    // 4. Cancel: Throw away the typed text and reset to original
    const handleCancel = () => {
        setDraftData(formData);
        setIsEditing(false);
    };

    // 5. Save: Send the draft to the parent's handleInputChange function
    const handleSaveClick = () => {
        // Loop through the draft and update the parent only for changed fields
        Object.keys(draftData).forEach((key) => {
            if (draftData[key] !== formData[key]) {
                onChange(key, draftData[key]);
            }
        });

        setIsEditing(false);
        if (onSave) {
            onSave(draftData); // <--- REMOVE setTimeout AND PASS draftData
        }
    };

    // --- Fetch Cities ---
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

    // --- Fetch Nationalities ---
    useEffect(() => {
        const fetchNationalities = async () => {
            try {
                const response = await fetch("https://countriesnow.space/api/v0.1/countries/flag/unicode");
                const result = await response.json();
                const sortedData = result.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
                const formattedCountries = sortedData.map((country: any) => `${country.name}`);
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
                        onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                        className="text-[#1a6b36] text-sm font-medium hover:underline"
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                )}
            </div>

            {/* Form Fields - Now wired to 'draftData' and 'handleLocalChange' */}
            <div className="space-y-6">
                <ProfileField label="Surname" value={draftData.surname} isEditing={isEditing} placeholder="DELA CRUZ" onChange={(e: any) => handleLocalChange("surname", e.target.value)} required />
                <ProfileField label="First Name" value={draftData.firstname} isEditing={isEditing} placeholder="JUAN" onChange={(e: any) => handleLocalChange("firstname", e.target.value)} required />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField label="Middle Name" value={draftData.middlename} isEditing={isEditing} placeholder="SANTOS" onChange={(e: any) => handleLocalChange("middlename", e.target.value)} />
                    <ProfileField label="Extension" value={draftData.extension} isEditing={isEditing} placeholder="JR." onChange={(e: any) => handleLocalChange("extension", e.target.value)} />

                    <ProfileField label="Date of Birth" value={draftData.birthdate} type="date" isEditing={isEditing} onChange={(e: any) => handleLocalChange("birthdate", e.target.value)} />

                    {isLoadingCities ? (
                        <LoadingPlaceholder label="Place of Birth" />
                    ) : (
                        <ProfileSelect label="Place of Birth" value={draftData.birthplace} options={cityOptions} isEditing={isEditing} onChange={(e: any) => handleLocalChange("birthplace", e.target.value)} />
                    )}

                    <ProfileSelect label="Sex" value={draftData.sex} options={SEX} isEditing={isEditing} onChange={(e: any) => handleLocalChange("sex", e.target.value)} required />
                    <ProfileSelect label="Civil Status" value={draftData.civil_status} options={CIVIL_STATUS} isEditing={isEditing} onChange={(e: any) => handleLocalChange("civil_status", e.target.value)} required />

                    <ProfileField label="Telephone No." value={draftData.telephone_no} isEditing={isEditing} placeholder="0909-XXX-XXXX" onChange={(e: any) => handleLocalChange("telephone_no", e.target.value)} />
                    <ProfileField label="Mobile No." value={draftData.mobile_no} isEditing={isEditing} placeholder="0999-XXX-XXXX" onChange={(e: any) => handleLocalChange("mobile_no", e.target.value)} />
                </div>

                <ProfileField label="Personal Email Address" type="email" value={draftData.email} isEditing={isEditing} placeholder="jdelacruz@lakeshore.edu.ph" onChange={(e: any) => handleLocalChange("email", e.target.value)} />

                {isLoadingNationalities ? (
                    <LoadingPlaceholder label="Nationality" />
                ) : (
                    <ProfileSelect label="Nationality" value={draftData.nationality} options={nationalityOptions} isEditing={isEditing} onChange={(e: any) => handleLocalChange("nationality", e.target.value)} required />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProfileField label="Height" value={draftData.height} isEditing={isEditing} placeholder="1.79M" onChange={(e: any) => handleLocalChange("height", e.target.value)} />
                    <ProfileField label="Weight" value={draftData.weight} isEditing={isEditing} placeholder="80KG" onChange={(e: any) => handleLocalChange("weight", e.target.value)} />
                    <ProfileField label="Blood Type" value={draftData.blood_type} isEditing={isEditing} placeholder="O+" onChange={(e: any) => handleLocalChange("blood_type", e.target.value)} />
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
// HELPER COMPONENTS
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
                    value={value || ""}
                    placeholder={placeholder}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className={`w-full p-2.5 border rounded-lg text-sm transition-all shadow-sm outline-none 
                    ${type === 'text' ? 'uppercase' : ''} 
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
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}