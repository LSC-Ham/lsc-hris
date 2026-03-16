"use client";

import { useState, useEffect } from "react";
import countriesData from "@/data/countries.json";

const CIVIL_STATUS = ["Single", "Married", "Divorced", "Widowed", "Separated", "Domestic Partnership", "Civil Union"];
const SEX = ["Male", "Female", "Non-binary", "Other/Prefer not to say"];

const countriesArray = countriesData.data;

const phData = countriesArray.find((item: any) => item.iso2 === "PH");
const rawCities = phData ? phData.cities : [];
const uniqueSortedCities = Array.from(new Set(rawCities)).sort((a: any, b: any) => a.localeCompare(b));

const rawNationalities = countriesArray.map((item: any) => item.country);
const uniqueSortedNationalities = Array.from(new Set(rawNationalities)).sort((a: any, b: any) => a.localeCompare(b));

interface PersonalInformationProps {
    mode?: "view" | "create";
    formData: any;
    onSave?: (data: any) => void; 
    onChange?: (updatedFields: any) => void;
}

export function PersonalInformation({ mode = "view", formData, onSave, onChange }: PersonalInformationProps) {
    const [isEditing, setIsEditing] = useState(mode === "create");

    const [draftData, setDraftData] = useState(formData);

    useEffect(() => {
        setDraftData(formData);
    }, [formData]);


    const formatDate = (dateString: Date) => {
        if (!dateString) return "Present";
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    const handleLocalChange = (field: string, value: any) => {
        setDraftData((prev: any) => ({ ...prev, [field]: value }));

        if (onChange) {
            onChange({ [field]: value });
        }
    };

    const handleCancel = () => {
        setDraftData(formData);
        setIsEditing(false);
    };
    const handleSaveClick = () => {
        Object.keys(draftData).forEach((key) => {
            if (draftData[key] !== formData[key]) {
            }
        });

        setIsEditing(false);
        if (onSave) {
            onSave(draftData); 
        }
    };

    return (
        <div className="space-y-6">
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

            <div className="space-y-6">
                <ProfileField label="Surname" value={draftData.surname} isEditing={isEditing} placeholder="DELA CRUZ" onChange={(e: any) => handleLocalChange("surname", e.target.value)} required />
                <ProfileField label="First Name" value={draftData.firstname} isEditing={isEditing} placeholder="JUAN" onChange={(e: any) => handleLocalChange("firstname", e.target.value)} required />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField label="Middle Name" value={draftData.middlename} isEditing={isEditing} placeholder="SANTOS" onChange={(e: any) => handleLocalChange("middlename", e.target.value)} />
                    <ProfileField label="Extension" value={draftData.extension} isEditing={isEditing} placeholder="JR." onChange={(e: any) => handleLocalChange("extension", e.target.value)} />

                    <ProfileField
                        label="Date of Birth"
                        value={
                            isEditing
                                ? (draftData.birthdate ? String(draftData.birthdate).substring(0, 10) : "")
                                : formatDate(draftData.birthdate)
                        }
                        type="date"
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("birthdate", e.target.value)}
                    />
                    <ProfileSelect label="Place of Birth" value={draftData.birthplace} options={uniqueSortedCities} isEditing={isEditing} onChange={(e: any) => handleLocalChange("birthplace", e.target.value)} />

                    <ProfileSelect label="Sex" value={draftData.sex} options={SEX} isEditing={isEditing} onChange={(e: any) => handleLocalChange("sex", e.target.value)} required />
                    <ProfileSelect label="Civil Status" value={draftData.civil_status} options={CIVIL_STATUS} isEditing={isEditing} onChange={(e: any) => handleLocalChange("civil_status", e.target.value)} required />

                    <ProfileField label="Telephone No." value={draftData.telephone_no} isEditing={isEditing} placeholder="0909-XXX-XXXX" onChange={(e: any) => handleLocalChange("telephone_no", e.target.value)} />
                    <ProfileField label="Mobile No." value={draftData.mobile_no} isEditing={isEditing} placeholder="0999-XXX-XXXX" onChange={(e: any) => handleLocalChange("mobile_no", e.target.value)} />
                </div>

                <ProfileField label="Personal Email Address" type="email" value={draftData.email} isEditing={isEditing} placeholder="jdelacruz@lakeshore.edu.ph" onChange={(e: any) => handleLocalChange("email", e.target.value)} />

                <ProfileSelect label="Nationality" value={draftData.nationality} options={uniqueSortedNationalities} isEditing={isEditing} onChange={(e: any) => handleLocalChange("nationality", e.target.value)} required />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProfileField label="Height" value={draftData.height} isEditing={isEditing} placeholder="1.79M" onChange={(e: any) => handleLocalChange("height", e.target.value)} />
                    <ProfileField label="Weight" value={draftData.weight} isEditing={isEditing} placeholder="80KG" onChange={(e: any) => handleLocalChange("weight", e.target.value)} />
                    <ProfileField label="Blood Type" value={draftData.blood_type} isEditing={isEditing} placeholder="O+" onChange={(e: any) => handleLocalChange("blood_type", e.target.value)} />
                </div>
            </div>

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
                    ${type === 'text'} 
                    ${disabled
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                            : "bg-white focus:ring-1 " + (required && !value ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500")
                        }`}
                />
            ) : (
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center uppercase">
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
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center uppercase">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}