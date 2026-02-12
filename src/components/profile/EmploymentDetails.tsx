"use client";

import { useState, useEffect } from "react";
import { getSystemData } from "@/actions/settings";

const POSITION_STATUSES = ["Full-Time", "Part-Time",];

interface EmploymentDetailsProps {
    mode?: "view" | "create";
    formData: any;
    onChange: (field: string, value: any) => void;
}

export function EmploymentDetails({ mode = "view", formData, onChange }: EmploymentDetailsProps) {

    // 1. Create State to hold the DB Options
    const [divisions, setDivisions] = useState<string[]>([]);
    const [departments, setDepartments] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]); // Fixed typo (postions -> positions)
    const [isLoading, setIsLoading] = useState(true);

    // 2. Fetch the data directly inside this component
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSystemData();

                const divList = data.divisions.map((d: any) => d.division);
                const depList = data.departments.map((d: any) => d.department);

                // Fixed: mapped 'd.position' (singular) assuming your DB column is named 'position'
                const posList = data.positions.map((d: any) => d.position);

                setDivisions(divList);
                setDepartments(depList);
                setPositions(posList);
            } catch (error) {
                console.error("Failed to fetch options:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // UI State
    const [isEditing, setIsEditing] = useState(mode === "create");

    // Temp State for "Add Position"
    const [tempPosition, setTempPosition] = useState({
        position: "", status: "", description: "", start_at: "", end_at: ""
    });

    const handleTempChange = (field: string, value: string) => {
        setTempPosition((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddPositionObj = () => {
        if (!tempPosition.position || !tempPosition.status) return;
        const updatedPositions = [...(formData.positions || []), tempPosition];
        onChange("positions", updatedPositions);
        setTempPosition({ position: "", status: "", description: "", start_at: "", end_at: "" });
    };

    const handleRemovePosition = (indexToRemove: number) => {
        const updatedPositions = formData.positions.filter((_: any, index: number) => index !== indexToRemove);
        onChange("positions", updatedPositions);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Employment Details</h1>
                {mode !== "create" && (
                    <button type="button" onClick={() => setIsEditing(!isEditing)} className="text-[#1a6b36] text-sm font-medium">
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                )}
            </div>

            <div className="space-y-8">
                {/* ID & Dept */}
                <div className="space-y-6">
                    <ProfileField
                        label="Employee ID Number"
                        value={formData.id_number}
                        isEditing={isEditing}
                        onChange={(e: any) => onChange("id_number", e.target.value)}
                        required
                        disabled={true} // <--- ADD THIS LINE
                    />

                    {/* Division & Department Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoading ? (
                            <div className="col-span-2 text-xs text-gray-400 animate-pulse">Loading options...</div>
                        ) : (
                            <>
                                <ProfileSelect
                                    label="Division"
                                    value={formData.division}
                                    options={divisions}
                                    isEditing={isEditing}
                                    onChange={(e: any) => onChange("division", e.target.value)}
                                    required
                                />
                                <ProfileSelect
                                    label="Department"
                                    value={formData.department}
                                    options={departments}
                                    isEditing={isEditing}
                                    onChange={(e: any) => onChange("department", e.target.value)}
                                    required
                                />
                            </>
                        )}
                    </div>

                    {/* Positions Logic */}
                    <div className="border-t border-gray-100 pt-6">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-4">
                            Assigned Positions & History
                        </label>

                        {/* List */}
                        <div className="space-y-3 mb-4">
                            {formData.positions && formData.positions.length > 0 ? (
                                formData.positions.map((pos: any, index: number) => (
                                    <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-800">{pos.position}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${pos.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{pos.status}</span>
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {pos.start_at} {pos.end_at ? `— ${pos.end_at}` : "— Present"}
                                            </div>
                                        </div>
                                        {isEditing && (
                                            <button type="button" onClick={() => handleRemovePosition(index)} className="text-red-500 hover:text-red-700 text-xs mt-2 sm:mt-0">Remove</button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                !isEditing && <div className="text-sm text-gray-400 italic">No positions assigned.</div>
                            )}
                        </div>

                        {/* Add Form */}
                        {isEditing && (
                            <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 space-y-4">
                                <h4 className="text-xs font-bold text-[#1a6b36] uppercase">Add New Position</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* UPDATED: Uses 'positions' state instead of POSITION_OPTIONS */}
                                    <ProfileSelect
                                        label="Position Title"
                                        value={tempPosition.position}
                                        options={positions}
                                        isEditing={true}
                                        onChange={(e: any) => handleTempChange("position", e.target.value)}
                                        required
                                    />

                                    <ProfileSelect label="Status" value={tempPosition.status} options={POSITION_STATUSES} isEditing={true} onChange={(e: any) => handleTempChange("status", e.target.value)} required />
                                </div>
                                <ProfileField label="Description" value={tempPosition.description} isEditing={true} placeholder="Optional details..." onChange={(e: any) => handleTempChange("description", e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <ProfileField label="Start Date" type="date" value={tempPosition.start_at} isEditing={true} onChange={(e: any) => handleTempChange("start_at", e.target.value)} required />
                                    <ProfileField label="End Date (Optional)" type="date" value={tempPosition.end_at} isEditing={true} onChange={(e: any) => handleTempChange("end_at", e.target.value)} />
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" onClick={handleAddPositionObj} disabled={!tempPosition.position || !tempPosition.status} className="bg-[#1a6b36] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#155a2b] disabled:opacity-50">+ Add Position</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* IDs */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Government Identifiers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField label="GSIS No." value={formData.gsis_no} isEditing={isEditing} onChange={(e: any) => onChange("gsis_no", e.target.value)} />
                        <ProfileField label="Pag-IBIG No." value={formData.pagibig_no} isEditing={isEditing} onChange={(e: any) => onChange("pagibig_no", e.target.value)} />
                        <ProfileField label="PhilHealth No." value={formData.philhealth_no} isEditing={isEditing} onChange={(e: any) => onChange("philhealth_no", e.target.value)} />
                        <ProfileField label="SSS No." value={formData.sss_no} isEditing={isEditing} onChange={(e: any) => onChange("sss_no", e.target.value)} />
                        <ProfileField label="TIN No." value={formData.tin_no} isEditing={isEditing} onChange={(e: any) => onChange("tin_no", e.target.value)} />
                        <ProfileField label="Agency No." value={formData.agency_no} isEditing={isEditing} onChange={(e: any) => onChange("agency_no", e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Keep your Helper Functions (ProfileField / ProfileSelect) here as they were
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