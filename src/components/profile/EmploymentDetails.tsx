"use client";

import { useState, useEffect } from "react";
import { getSystemData } from "@/actions/settings";

const POSITION_STATUSES = ["Full-Time", "Part-Time"];

interface EmploymentDetailsProps {
    mode?: "view" | "create";
    formData: any;
    onChange: (field: string, value: any) => void;
}

export function EmploymentDetails({ mode = "view", formData, onChange }: EmploymentDetailsProps) {
    // --- Data Options State ---
    const [divisions, setDivisions] = useState<string[]>([]);
    const [departments, setDepartments] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- UI State ---
    const [isEditing, setIsEditing] = useState(mode === "create");
    const [tempPosition, setTempPosition] = useState({
        position: "", status: "", description: "", start_at: "", end_at: ""
    });

    const formatDate = (dateString: string | Date) => {
        if (!dateString) return "Present";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', year: 'numeric'
        });
    };

    // --- Fetch System Options ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSystemData();
                setDivisions(data.divisions.map((d: any) => d.division));
                setDepartments(data.departments.map((d: any) => d.department));
                setPositions(data.positions.map((d: any) => d.position));
            } catch (error) {
                console.error("Failed to fetch options:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- Handlers ---
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
                    <button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-[#1a6b36] text-sm font-medium hover:underline"
                    >
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
                        disabled={true}
                    />

                    {/* Division & Department Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoading ? (
                            <div className="col-span-2 text-xs text-gray-400 animate-pulse">Loading system options...</div>
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
                                    <div
                                        key={pos.id || index}
                                        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border transition-colors ${pos.status === 'Active'
                                                ? 'bg-white border-green-200 shadow-sm'
                                                : 'bg-gray-50 border-gray-100 opacity-75'
                                            }`}
                                    >
                                        {/* Left Side: Position Info */}
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-800 text-sm">
                                                    {pos.position}
                                                </h4>

                                                {/* Status Badge */}
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border ${pos.status === 'Active'
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-gray-200 text-gray-600 border-gray-300'
                                                    }`}>
                                                    {pos.status || 'N/A'}
                                                </span>
                                            </div>

                                            {/* Description (if exists) */}
                                            {pos.description && (
                                                <p className="text-xs text-gray-500 line-clamp-1">
                                                    {pos.description}
                                                </p>
                                            )}

                                            {/* Date Range */}
                                            <div className="flex items-center gap-1 text-xs text-gray-400 font-medium mt-1">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>
                                                    {formatDate(pos.start_at)} — {pos.end_at ? formatDate(pos.end_at) : <span className="text-green-600">Present</span>}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Side: Actions (Only show in Edit Mode) */}
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePosition(index)}
                                                className="group flex items-center gap-1 text-red-400 hover:text-red-600 text-xs font-medium mt-3 sm:mt-0 transition-colors"
                                            >
                                                <span>Remove</span>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                // Empty State
                                <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-lg">
                                    <p className="text-sm text-gray-400 italic">No position history found.</p>
                                </div>
                            )}
                        </div>

                        {/* Add Form */}
                        {isEditing && (
                            <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 space-y-4">
                                <h4 className="text-xs font-bold text-[#1a6b36] uppercase">Add New Position</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ProfileSelect
                                        label="Position Title"
                                        value={tempPosition.position}
                                        options={positions}
                                        isEditing={true}
                                        onChange={(e: any) => handleTempChange("position", e.target.value)}
                                        required
                                    />
                                    <ProfileSelect
                                        label="Status"
                                        value={tempPosition.status}
                                        options={POSITION_STATUSES}
                                        isEditing={true}
                                        onChange={(e: any) => handleTempChange("status", e.target.value)}
                                        required
                                    />
                                </div>
                                <ProfileField
                                    label="Description"
                                    value={tempPosition.description}
                                    isEditing={true}
                                    placeholder="Optional details..."
                                    onChange={(e: any) => handleTempChange("description", e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <ProfileField
                                        label="Start Date"
                                        type="date"
                                        value={tempPosition.start_at}
                                        isEditing={true}
                                        onChange={(e: any) => handleTempChange("start_at", e.target.value)}
                                        required
                                    />
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
                                        className="bg-[#1a6b36] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#155a2b] disabled:opacity-50 transition-colors"
                                    >
                                        + Add Position
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* IDs */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                        Government Identifiers
                    </h3>
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

// --- Reusable Helper Components ---

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
                    ${required && !value ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}
                    ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
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