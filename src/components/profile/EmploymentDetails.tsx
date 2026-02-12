// src/components/profile/EmploymentDetails.tsx
"use client";

import { useState } from "react";

// --- MOCK DATA ---
const DIVISIONS = ["Administration", "Operations", "Finance", "Sales", "Engineering"];
const DEPARTMENTS = ["HR", "IT", "Logistics", "Accounting", "Marketing", "Legal"];

// Existing Positions (Simulating the 'positions' table)
const POSITION_OPTIONS = [
    "Software Engineer", "Senior Developer", "Team Lead", "Project Manager",
    "Data Analyst", "UI/UX Designer", "HR Officer", "Accountant"
];

// New Status Options (for employees_positions.status)
const POSITION_STATUSES = ["Active", "Probationary", "Acting", "Project-Based", "Resigned"];

interface EmploymentDetailsProps {
    mode?: "view" | "create";
    initialData?: any;
}

export function EmploymentDetails({ mode = "view", initialData }: EmploymentDetailsProps) {

    const [isEditing, setIsEditing] = useState(mode === "create");

    // 1. MAIN FORM STATE
    const [formData, setFormData] = useState(initialData || {
        id_number: "",
        division: "",
        department: "",
        positions: [], // Now an array of objects: { position, status, description, start_at, end_at }
        // ... other fields
        gsis_no: "",
        pagibig_no: "",
        philhealth_no: "",
        sss_no: "",
        tin_no: "",
        agency_no: "",
    });

    // 2. TEMP STATE (For the "Add Position" mini-form)
    const [tempPosition, setTempPosition] = useState({
        position: "",
        status: "",
        description: "",
        start_at: "",
        end_at: ""
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    // --- NEW LOGIC: Handle Temp Form Input ---
    const handleTempChange = (field: string, value: string) => {
        setTempPosition((prev) => ({ ...prev, [field]: value }));
    };

    // --- NEW LOGIC: Add Object to Main List ---
    const handleAddPositionObj = () => {
        // Validation: Must select at least Position and Status
        if (!tempPosition.position || !tempPosition.status) return;

        setFormData((prev: any) => ({
            ...prev,
            positions: [...(prev.positions || []), tempPosition]
        }));

        // Reset Temp Form
        setTempPosition({
            position: "",
            status: "",
            description: "",
            start_at: "",
            end_at: ""
        });
    };

    // --- NEW LOGIC: Remove Object from Main List ---
    const handleRemovePosition = (indexToRemove: number) => {
        setFormData((prev: any) => ({
            ...prev,
            positions: prev.positions.filter((_: any, index: number) => index !== indexToRemove)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Employment Details Submitted:", formData);
        setIsEditing(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
            {/* 1. HEADER */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Employment Details</h1>
                {mode !== "create" && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isEditing ? "text-gray-500 hover:text-gray-700" : "text-[#1a6b36] hover:bg-green-50"
                            }`}
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                )}
            </div>

            <div className="space-y-8">
                {/* 2. EMPLOYMENT STATUS SECTION */}
                <div className="space-y-6">
                    <ProfileField
                        label="Employee ID Number"
                        value={formData.id_number}
                        isEditing={isEditing}
                        onChange={(e: any) => handleChange("id_number", e.target.value)}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileSelect
                            label="Division"
                            value={formData.division}
                            options={DIVISIONS}
                            isEditing={isEditing}
                            onChange={(e: any) => handleChange("division", e.target.value)}
                            required
                        />
                        <ProfileSelect
                            label="Department"
                            value={formData.department}
                            options={DEPARTMENTS}
                            isEditing={isEditing}
                            onChange={(e: any) => handleChange("department", e.target.value)}
                            required
                        />
                    </div>

                    {/* --- COMPLEX POSITIONS SECTION --- */}
                    <div className="border-t border-gray-100 pt-6">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-4">
                            Assigned Positions & History
                        </label>

                        {/* A. LIST OF ADDED POSITIONS (Cards) */}
                        <div className="space-y-3 mb-4">
                            {formData.positions && formData.positions.length > 0 ? (
                                formData.positions.map((pos: any, index: number) => (
                                    <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-800">{pos.position}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide
                                                    ${pos.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                                    {pos.status}
                                                </span>
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {pos.description && <span className="block italic mb-1">"{pos.description}"</span>}
                                                <span className="text-gray-400">
                                                    {pos.start_at} {pos.end_at ? `— ${pos.end_at}` : "— Present"}
                                                </span>
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePosition(index)}
                                                className="text-red-500 hover:text-red-700 text-xs font-medium mt-2 sm:mt-0"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                !isEditing && <div className="text-sm text-gray-400 italic">No positions assigned.</div>
                            )}
                        </div>

                        {/* B. ADD NEW POSITION FORM (Only visible in Edit Mode) */}
                        {isEditing && (
                            <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 space-y-4">
                                <h4 className="text-xs font-bold text-[#1a6b36] uppercase">Add New Position</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Position Name */}
                                    <ProfileSelect
                                        label="Position Title"
                                        value={tempPosition.position}
                                        options={POSITION_OPTIONS}
                                        isEditing={true}
                                        onChange={(e: any) => handleTempChange("position", e.target.value)}
                                        required
                                    />
                                    {/* Status */}
                                    <ProfileSelect
                                        label="Status"
                                        value={tempPosition.status}
                                        options={POSITION_STATUSES}
                                        isEditing={true}
                                        onChange={(e: any) => handleTempChange("status", e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <ProfileField
                                    label="Description"
                                    value={tempPosition.description}
                                    isEditing={true}
                                    placeholder="Optional details..."
                                    onChange={(e: any) => handleTempChange("description", e.target.value)}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Start Date */}
                                    <ProfileField
                                        label="Start Date"
                                        type="date"
                                        value={tempPosition.start_at}
                                        isEditing={true}
                                        onChange={(e: any) => handleTempChange("start_at", e.target.value)}
                                        required
                                    />
                                    {/* End Date (Nullable) */}
                                    <ProfileField
                                        label="End Date (Optional)"
                                        type="date"
                                        value={tempPosition.end_at}
                                        isEditing={true}
                                        onChange={(e: any) => handleTempChange("end_at", e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleAddPositionObj}
                                        disabled={!tempPosition.position || !tempPosition.status}
                                        className="bg-[#1a6b36] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#155a2b] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        + Add Position
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. GOVERNMENT IDENTIFIERS (Same as before) */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                        Government Identifiers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField label="GSIS No." value={formData.gsis_no} isEditing={isEditing} onChange={(e: any) => handleChange("gsis_no", e.target.value)} />
                        <ProfileField label="Pag-IBIG No." value={formData.pagibig_no} isEditing={isEditing} onChange={(e: any) => handleChange("pagibig_no", e.target.value)} />
                        <ProfileField label="PhilHealth No." value={formData.philhealth_no} isEditing={isEditing} onChange={(e: any) => handleChange("philhealth_no", e.target.value)} />
                        <ProfileField label="SSS No." value={formData.sss_no} isEditing={isEditing} onChange={(e: any) => handleChange("sss_no", e.target.value)} />
                        <ProfileField label="TIN No." value={formData.tin_no} isEditing={isEditing} onChange={(e: any) => handleChange("tin_no", e.target.value)} />
                        <ProfileField label="Agency No." value={formData.agency_no} isEditing={isEditing} onChange={(e: any) => handleChange("agency_no", e.target.value)} />
                    </div>
                </div>
            </div>

            {/* 4. FOOTER */}
            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                {isEditing && (
                    <button
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

// --- HELPER 1: Profile Field (Updated with type support) ---
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

// --- HELPER 2: Profile Select ---
function ProfileSelect({ label, value, options, isEditing, onChange, required }: any) {
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
                        className={`w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-1 outline-none transition-all shadow-sm appearance-none
                        ${required && !value ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
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