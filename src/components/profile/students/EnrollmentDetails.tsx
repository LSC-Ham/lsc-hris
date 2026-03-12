// src/components/profile/students/EnrollmentDetails.tsx
"use client";

import { useState, useEffect } from "react";
import { SearchFilterBar } from "../../sms/SearchFilter";

interface GenericData { id: string; name: string; }
interface YearData { id: string; year: string; acad_level_id: string; }
interface SectionData { id: string; section: string; acad_level_id: string; }

interface EnrollmentDetailsProps {
    mode?: "view" | "update" | "create";
    formData: any;
    onSave?: (updatedData: any) => void;
    onChange?: (updatedFields: any) => void;
    onFilterChange?: (filters: { acad_year_id: string; semester_id: string }) => void;
    acadYears: GenericData[];
    semesters: GenericData[];
    acadLevel: GenericData[];
    courses: GenericData[];
    years: YearData[];
    section: SectionData[];
    scholarship: GenericData[];
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

    const [filterYear, setFilterYear] = useState(formData?.acad_year_id || "");
    const [filterSemester, setFilterSemester] = useState(formData?.semester_id || "");

    useEffect(() => {
        const initialData = formData || {};
        setDraftData({ ...initialData });

        if (initialData.acad_year_id) setFilterYear(initialData.acad_year_id);
        if (initialData.semester_id) setFilterSemester(initialData.semester_id);
    }, [formData]);


    // --- DYNAMIC DATA COMPUTATIONS ---
    const selectedAcadLevelId = draftData.acad_level_id;
    const selectedAcadLevelObj = acadLevel.find(level => level.id === selectedAcadLevelId);
    const selectedLevelName = selectedAcadLevelObj?.name?.toLowerCase() || "";

    const isCollegeLevel = selectedLevelName !== "" &&
        !selectedLevelName.includes("jhs") &&
        !selectedLevelName.includes("shs") &&
        !selectedLevelName.includes("junior") &&
        !selectedLevelName.includes("senior");

    // Helper to format raw data into { id, label } for our updated Select component
    const formatOptions = (arr: any[], labelKey: string) =>
        arr.map(item => ({ id: item.id, label: item[labelKey] }));

    const acadLevelOptions = formatOptions(acadLevel, "name");
    const courseOptions = formatOptions(courses, "name");
    const scholarshipOptions = formatOptions(scholarship, "name");

    const dynamicYears = selectedAcadLevelId
        ? formatOptions(years.filter(y => y.acad_level_id === selectedAcadLevelId), "year")
        : [];

    const dynamicSections = selectedAcadLevelId
        ? formatOptions(section.filter(s => s.acad_level_id === selectedAcadLevelId), "section")
        : [];


    // --- HANDLERS ---
    const handleLocalChange = (field: string, value: any) => {
        setDraftData((prev: any) => {
            const newData = { ...prev, [field]: value };

            // Cascade reset if Academic Level changes
            if (field === "acad_level_id") {
                newData.year_level_id = "";
                newData.sections_id = "";
                newData.course_id = "";
            }

            return newData;
        });

        if (onChange) {
            onChange({ [field]: value });
        }
    };

    // Note: Assuming SearchFilterBar passes back IDs. If it passes names, it will need a slight update too.
    const handleFilterChange = (filters: { search?: string; acad_year: string; semester: string }) => {
        // Here we assume the filter bar gives us the IDs (mapped to acad_year/semester keys)
        setFilterYear(filters.acad_year);
        setFilterSemester(filters.semester);

        if (onFilterChange) {
            onFilterChange({
                acad_year_id: filters.acad_year,
                semester_id: filters.semester,
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
                acad_year_id: filterYear,
                semester_id: filterSemester
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
            </div>

            <div className="space-y-6">
                <SearchFilterBar
                    acadYears={acadYears}
                    semesters={semesters}
                    initialAcadYear={filterYear}
                    initialSemester={filterSemester}
                    onFilterChange={handleFilterChange}
                    showSearch={false}
                    disabled={isEditing}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField
                        label="Student ID Number"
                        value={draftData.id_number}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("id_number", e.target.value)}
                        disabled={true}
                    />
                    <ProfileField
                        label="Status"
                        value={draftData.created_at ? "Enrolled" : "Not Enrolled"}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("created_at", e.target.value)}
                        disabled={true}
                    />
                    <ProfileSelect
                        label="Academic Level"
                        value={draftData.acad_level_id}
                        options={acadLevelOptions}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("acad_level_id", e.target.value)}
                        required
                    />
                    <ProfileSelect
                        label="Course"
                        value={draftData.course_id}
                        options={courseOptions}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("course_id", e.target.value)}
                        required={isCollegeLevel}
                        disabled={!isCollegeLevel}
                    />
                    <ProfileSelect
                        label="Year"
                        value={draftData.year_level_id}
                        options={dynamicYears}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("year_level_id", e.target.value)}
                        required
                    />
                    <ProfileSelect
                        label="Section"
                        value={draftData.sections_id}
                        options={dynamicSections}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("sections_id", e.target.value)}
                        required
                    />
                    <ProfileSelect
                        label="Scholarship"
                        value={draftData.scholarship_id}
                        options={scholarshipOptions}
                        isEditing={isEditing}
                        onChange={(e: any) => handleLocalChange("scholarship_id", e.target.value)}
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
// HELPER COMPONENTS
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
                    ${disabled
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                            : "bg-white focus:ring-1 " + (required && !value ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-[#1a6b36]")
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
    // Find the readable label for the current value ID
    const selectedOption = options.find((opt: any) => opt.id === value);
    const displayLabel = selectedOption ? selectedOption.label : "";

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
                                : "bg-white focus:ring-1 outline-none " + (required && !value ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-[#1a6b36]")
                            }`}
                    >
                        <option value="" disabled>Select {label}</option>
                        {options.map((opt: any) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            ) : (
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center uppercase">
                    {displayLabel || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}