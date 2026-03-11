// src/components/profile/EnrollmentDetails.tsx
"use client";

import { useState, useEffect } from "react";

// 1. Update your interfaces to accept objects instead of just strings
interface AcadLevelData { id: string; name: string; }
interface YearData { id: string; year: string; acad_level_id: string; }
interface SectionData { id: string; section: string; acad_level_id: string; }

interface EnrollmentDetailsProps {
    mode?: "view" | "update" | "create";
    formData: any;
    onSave?: (updatedData: any) => void;
    onChange?: (updatedFields: any) => void;
    onFilterChange?: (filters: { acad_year: string; semester: string }) => void;
    acadYears: string[];
    semesters: string[];
    acadLevel: AcadLevelData[]; // Updated
    courses: string[];
    years: YearData[];          // Updated
    section: SectionData[];     // Updated
    scholarship: string[];
}

export function EnrollmentDetails({
    mode = "view",
    formData,
    onSave,
    onChange,
    onFilterChange,
    acadYears = [],
    semesters = [],
    acadLevel = [],
    courses = [],
    years = [],
    section = [],
    scholarship = []
}: EnrollmentDetailsProps) {
    const [isEditing, setIsEditing] = useState(mode === "create");
    const [draftData, setDraftData] = useState<any>({});

    const [filterYear, setFilterYear] = useState(formData?.acad_year || "");
    const [filterSemester, setFilterSemester] = useState(formData?.semester || "");

    useEffect(() => {
        const initialData = formData || {};
        setDraftData({ ...initialData });

        if (initialData.acad_year) setFilterYear(initialData.acad_year);
        if (initialData.semester) setFilterSemester(initialData.semester);
    }, [formData]);


    const selectedAcadLevelObj = acadLevel.find(level => level.name === draftData.acad_level);
    const selectedAcadLevelId = selectedAcadLevelObj?.id;

    const selectedLevelName = draftData.acad_level?.toLowerCase() || "";
    const isCollegeLevel = selectedLevelName !== "" &&
        !selectedLevelName.includes("jhs") &&
        !selectedLevelName.includes("shs") &&
        !selectedLevelName.includes("junior") &&
        !selectedLevelName.includes("senior");

    const dynamicYears = selectedAcadLevelId
        ? years.filter(y => y.acad_level_id === selectedAcadLevelId).map(y => y.year)
        : years.map(y => y.year);

    const dynamicSections = selectedAcadLevelId
        ? section.filter(s => s.acad_level_id === selectedAcadLevelId).map(s => s.section)
        : section.map(s => s.section);

    const acadLevelNames = acadLevel.map(l => l.name);

    const handleLocalChange = (field: string, value: any) => {
        setDraftData((prev: any) => {
            const newData = { ...prev, [field]: value };

            if (field === "acad_level") {
                newData.year = "";
                newData.section = "";
                newData.course = ""; // Clear the course too!
            }

            return newData;
        });

        if (onChange) {
            onChange({ [field]: value });
        }
    };

    const handleFilterChange = (field: "acad_year" | "semester", value: string) => {
        if (field === "acad_year") setFilterYear(value);
        if (field === "semester") setFilterSemester(value);

        if (onFilterChange) {
            onFilterChange({
                acad_year: field === "acad_year" ? value : filterYear,
                semester: field === "semester" ? value : filterSemester,
            });
        }
    };

    const handleCancel = () => {
        setDraftData({ ...(formData || {}) });
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        if (onSave) {
            onSave({
                ...draftData,
                acad_year: filterYear,
                semester: filterSemester
            });
        }
    };

    return (
        <div className="space-y-6">

            <div className="border-b border-gray-100 pb-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">Enrollment Details</h1>
                    {mode === "update" && (
                        <button
                            type="button"
                            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                            className="text-[#1a6b36] text-sm font-medium hover:underline"
                        >
                            {isEditing ? "Cancel" : "Edit Details"}
                        </button>
                    )}
                </div>

                <div className="rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                            Filter by Academic Year
                        </label>
                        <select
                            value={filterYear}
                            onChange={(e) => handleFilterChange("acad_year", e.target.value)}
                            disabled={isEditing}
                            className={`w-full p-2 border border-gray-200 rounded-md text-sm outline-none shadow-sm transition-colors
                                ${isEditing
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white focus:ring-1 focus:border-green-500 text-gray-800"
                                }`}
                        >
                            <option value="" disabled>Select Academic Year</option>
                            {acadYears.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                            Filter by Semester
                        </label>
                        <select
                            value={filterSemester}
                            onChange={(e) => handleFilterChange("semester", e.target.value)}
                            disabled={isEditing}
                            className={`w-full p-2 border border-gray-200 rounded-md text-sm outline-none shadow-sm transition-colors
                                ${isEditing
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white focus:ring-1 focus:border-green-500 text-gray-800"
                                }`}
                        >
                            <option value="" disabled>Select Semester</option>
                            {semesters.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Editable Details Form */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField
                        label="Student ID Number"
                        value={draftData.id_number}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("id_number", e.target.value)}
                        required
                        disabled={true}
                    />

                    <ProfileField
                        label="Status"
                        value={draftData.enrolled_at}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("enrolled_at", e.target.value)}
                        required
                        disabled={true}
                    />
                    <ProfileSelect
                        label="Academic Level"
                        value={draftData.acad_level}
                        options={acadLevelNames} // Pass mapped names
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("acad_level", e.target.value)}
                        required
                    />
                        <ProfileSelect
                            label="Course"
                            value={draftData.course}
                            options={courses}
                            isEditing={isEditing}
                            onChange={(e: any) => handleLocalChange("course", e.target.value)}
                            required={isCollegeLevel}
                            disabled={!isCollegeLevel}
                        />
                    <ProfileSelect
                        label="Year"
                        value={draftData.year}
                        options={dynamicYears} // Now perfectly reactive!
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("year", e.target.value)}
                        required
                    />
                    <ProfileSelect
                        label="Section"
                        value={draftData.section}
                        options={dynamicSections} // Now perfectly reactive!
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("section", e.target.value)}
                        required
                    />
                    <ProfileSelect
                        label="Scholarship"
                        value={draftData.scholarship}
                        options={scholarship}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("scholarship", e.target.value)}
                        required
                    />
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
// ----------------------------------------------------------------------
// HELPER COMPONENTS (Unchanged)
// ----------------------------------------------------------------------

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