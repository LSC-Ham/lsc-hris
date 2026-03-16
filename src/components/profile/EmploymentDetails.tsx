// src/components/hris/employees/EmploymentDetails.tsx
"use client";

import { useState, useEffect } from "react";

const POSITION_STATUSES = ["Full-Time", "Part-Time"];
const EMPLOYMENT_STATUSES = ["Probationary", "Regular", "Resigned", "Terminated"];

interface EmploymentDetailsProps {
    mode?: "view" | "update" | "create";
    formData: any;
    divisions?: string[];
    departments?: string[];
    availablePositions?: string[];
    onSave?: (updatedData: any) => void;
    onChange?: (updatedFields: any) => void;
}

export function EmploymentDetails({
    mode = "view",
    formData,
    divisions = [],
    departments = [],
    availablePositions = [],
    onSave,
    onChange
}: EmploymentDetailsProps) {
    const [isEditing, setIsEditing] = useState(mode === "create");
    const [draftData, setDraftData] = useState<any>({});

    const [assignedPosition, setAssignedPosition] = useState({
        position: "", status: "", description: "", start_at: "", end_at: "", is_active: false
    });

    const formatDateForInput = (dateVal: any) => {
        if (!dateVal) return "";
        if (typeof dateVal === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(dateVal)) {
            return dateVal.slice(0, 16);
        }
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return "";

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const formatHiredDateView = (dateVal: any) => {
        if (!dateVal) return "";
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return "";
        return d.toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
        });
    };

    const formatDate = (dateString: string | Date) => {
        if (!dateString) return "Present";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', year: 'numeric'
        });
    };

    useEffect(() => {
        const initialData = formData || {};
        const sortedPositions = [...(initialData.positions || [])].sort((a, b) =>
            (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1)
        );

        setDraftData({
            ...initialData,
            positions: sortedPositions,
            hired_at: formatDateForInput(initialData.hired_at)
        });
    }, [formData]);

    const handleLocalChange = (field: string, value: any) => {
        setDraftData((prev: any) => ({ ...prev, [field]: value }));
        if (onChange) {
            onChange({ [field]: value });
        }
    };

    const handleAssignedChange = (field: string, value: any) => {
        setAssignedPosition((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddPositionObj = () => {
        if (!assignedPosition.position || !assignedPosition.status) return;

        let updatedPositions = [...(draftData.positions || [])];

        if (assignedPosition.is_active) {
            updatedPositions = updatedPositions.map(p => ({ ...p, is_active: false }));
        } else if (updatedPositions.length === 0) {
            assignedPosition.is_active = true;
        }

        updatedPositions.push({ ...assignedPosition });

        updatedPositions.sort((a, b) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1));

        handleLocalChange("positions", updatedPositions);
        setAssignedPosition({ position: "", status: "", description: "", start_at: "", end_at: "", is_active: false });
    };

    const handleSetActivePosition = (indexToActivate: number) => {
        let updatedPositions = (draftData.positions || []).map((p: any, i: number) => ({
            ...p,
            is_active: i === indexToActivate
        }));

        updatedPositions.sort((a: any, b: any) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1));

        handleLocalChange("positions", updatedPositions);
    };

    const handleRemovePosition = (indexToRemove: number) => {
        const updatedPositions = (draftData.positions || []).filter((_: any, index: number) => index !== indexToRemove);
        handleLocalChange("positions", updatedPositions);
    };

    const handleCancel = () => {
        const initialData = formData || {};
        const sortedPositions = [...(initialData.positions || [])].sort((a, b) =>
            (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1)
        );

        setDraftData({
            ...initialData,
            positions: sortedPositions,
            hired_at: formatDateForInput(initialData.hired_at)
        });
        setIsEditing(false);
        setAssignedPosition({ position: "", status: "", description: "", start_at: "", end_at: "", is_active: false });
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        if (onSave) {
            onSave(draftData);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Employment Details</h1>

                {mode === "update" && (
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField
                        label="Employee ID Number"
                        value={draftData.id_number}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("id_number", e.target.value)}
                        required
                        disabled={true}
                    />
                    <ProfileSelect
                        label="Employment Status"
                        value={draftData.remarks}
                        options={EMPLOYMENT_STATUSES}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("remarks", e.target.value)}
                        required
                    />
                    <ProfileField
                        label="Date Hired"
                        type="datetime-local"
                        value={isEditing ? draftData.hired_at : formatHiredDateView(draftData.hired_at)}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("hired_at", e.target.value)}
                        required
                    />
                    <ProfileSelect
                        label="Division"
                        value={draftData.division}
                        options={divisions}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("division", e.target.value)}
                        required
                    />
                    <ProfileSelect
                        label="Department"
                        value={draftData.department}
                        options={departments}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("department", e.target.value)}
                        required
                    />
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4 capitalize">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-4">
                        Assigned Positions & History
                    </label>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {draftData.positions && draftData.positions.length > 0 ? (
                            draftData.positions.map((pos: any, index: number) => (
                                <div
                                    key={pos.id || index}
                                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border transition-all ${pos.is_active
                                            ? 'bg-white border-green-300 shadow-sm ring-1 ring-green-100'
                                            : 'bg-gray-50 border-gray-200 opacity-75'
                                        }`}
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`font-bold text-sm ${pos.is_active ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {pos.position}
                                            </h4>

                                            {pos.is_active && (
                                                <span className="px-2 py-[2px] rounded text-[9px] uppercase font-bold tracking-wider border bg-green-50 text-green-700 border-green-200">
                                                    Active Role
                                                </span>
                                            )}

                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border ${pos.end_at < new Date()
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-gray-200 text-gray-600 border-gray-300'
                                                }`}>
                                                {pos.status || 'N/A'}
                                            </span>
                                        </div>

                                        {pos.description && (
                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                {pos.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium mt-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>
                                                {formatDate(pos.start_at)} — {pos.end_at ? formatDate(pos.end_at) : <span className="text-green-600">Present</span>}
                                            </span>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex items-center gap-4 mt-3 sm:mt-0">
                                            {!pos.is_active && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetActivePosition(index)}
                                                    className="text-[#1a6b36] hover:text-green-800 text-xs font-semibold transition-colors"
                                                >
                                                    Set Active
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => handleRemovePosition(index)}
                                                className="group flex items-center gap-1 text-red-400 hover:text-red-600 text-xs font-medium transition-colors"
                                            >
                                                <span>Remove</span>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="grid col-span-full text-center py-6 border-2 border-dashed border-gray-100 rounded-lg">
                                <p className="text-sm text-gray-400 italic">No position history found.</p>
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 space-y-4">
                            <h4 className="text-xs font-bold text-[#1a6b36] uppercase">Add New Position</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ProfileSelect
                                    label="Position Title"
                                    value={assignedPosition.position}
                                    options={availablePositions}
                                    isEditing={true}
                                    onChange={(e: any) => handleAssignedChange("position", e.target.value)}
                                    required
                                />
                                <ProfileSelect
                                    label="Status"
                                    value={assignedPosition.status}
                                    options={POSITION_STATUSES}
                                    isEditing={true}
                                    onChange={(e: any) => handleAssignedChange("status", e.target.value)}
                                    required
                                />
                            </div>
                            <ProfileField
                                label="Description"
                                value={assignedPosition.description}
                                isEditing={true}
                                placeholder="Optional details..."
                                onChange={(e: any) => handleAssignedChange("description", e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <ProfileField
                                    label="Start Date"
                                    type="date"
                                    value={assignedPosition.start_at}
                                    isEditing={true}
                                    onChange={(e: any) => handleAssignedChange("start_at", e.target.value)}
                                    required
                                />
                                <ProfileField
                                    label="End Date (Optional)"
                                    type="date"
                                    value={assignedPosition.end_at}
                                    isEditing={true}
                                    onChange={(e: any) => handleAssignedChange("end_at", e.target.value)}
                                />
                            </div>

                            <div className="flex justify-between items-center border-t border-green-100 pt-4 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={assignedPosition.is_active}
                                        onChange={(e) => handleAssignedChange("is_active", e.target.checked)}
                                        className="w-4 h-4 text-[#1a6b36] rounded border-gray-300 focus:ring-[#1a6b36]"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Set as current Active Role</span>
                                </label>

                                <button
                                    type="button"
                                    onClick={handleAddPositionObj}
                                    disabled={!assignedPosition.position || !assignedPosition.status}
                                    className="bg-[#1a6b36] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#155a2b] disabled:opacity-50 transition-colors"
                                >
                                    + Add Position
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Government IDs */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                        Government Identifiers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField label="GSIS No." value={draftData.gsis_no} isEditing={isEditing} onChange={(e: any) => handleLocalChange("gsis_no", e.target.value)} />
                        <ProfileField label="Pag-IBIG No." value={draftData.pagibig_no} isEditing={isEditing} onChange={(e: any) => handleLocalChange("pagibig_no", e.target.value)} />
                        <ProfileField label="PhilHealth No." value={draftData.philhealth_no} isEditing={isEditing} onChange={(e: any) => handleLocalChange("philhealth_no", e.target.value)} />
                        <ProfileField label="SSS No." value={draftData.sss_no} isEditing={isEditing} onChange={(e: any) => handleLocalChange("sss_no", e.target.value)} />
                        <ProfileField label="TIN No." value={draftData.tin_no} isEditing={isEditing} onChange={(e: any) => handleLocalChange("tin_no", e.target.value)} />
                        <ProfileField label="Agency No." value={draftData.agency_no} isEditing={isEditing} onChange={(e: any) => handleLocalChange("agency_no", e.target.value)} />
                    </div>
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

function ProfileField({ label, value, isEditing, type = "text", placeholder, onChange, required, disabled }: any) {
    const displayValue = value instanceof Date ? value.toLocaleDateString() : value;

    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {isEditing ? (
                <input
                    type={type}
                    value={displayValue || ""}
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
                    {displayValue || <span className="text-gray-400 italic">Not set</span>}
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