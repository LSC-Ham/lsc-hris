// src/components/ui/SearchFilterBar.tsx
"use client";

import { useState, useEffect } from "react";

interface SearchFilterBarProps {
    acadYears?: string[];
    semesters?: string[];
    initialSearch?: string;
    initialAcadYear?: string;
    initialSemester?: string;
    onFilterChange: (filters: { search: string; acad_year: string; semester: string }) => void;
    searchPlaceholder?: string;
    disabled?: boolean;

    // NEW: Toggles to show/hide specific fields
    showSearch?: boolean;
    showAcadYear?: boolean;
    showSemester?: boolean;
}

export function SearchFilterBar({
    acadYears = [],
    semesters = [],
    initialSearch = "",
    initialAcadYear = "",
    initialSemester = "",
    onFilterChange,
    searchPlaceholder = "Search...",
    disabled = false,

    // Default them to true so they show up unless you explicitly say false
    showSearch = true,
    showAcadYear = true,
    showSemester = true
}: SearchFilterBarProps) {
    const [search, setSearch] = useState(initialSearch);
    const [acadYear, setAcadYear] = useState(initialAcadYear);
    const [semester, setSemester] = useState(initialSemester);

    useEffect(() => {
        setSearch(initialSearch);
        setAcadYear(initialAcadYear);
        setSemester(initialSemester);
    }, [initialSearch, initialAcadYear, initialSemester]);

    const handleFilterChange = (field: "search" | "acad_year" | "semester", value: string) => {
        if (field === "search") setSearch(value);
        if (field === "acad_year") setAcadYear(value);
        if (field === "semester") setSemester(value);

        onFilterChange({
            search: field === "search" ? value : search,
            acad_year: field === "acad_year" ? value : acadYear,
            semester: field === "semester" ? value : semester,
        });
    };

    return (
        <div className="rounded-xl space-y-4 md:space-y-0 md:flex md:items-center md:gap-6">
            {showSearch && (
                <div className="w-full">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                        Search
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            placeholder={searchPlaceholder}
                            disabled={disabled}
                            className={`w-full p-2.5 pl-10 border border-gray-200 rounded-md text-sm outline-none shadow-sm transition-colors
                                ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white focus:ring-1 focus:border-[#1a6b36] text-gray-800"}`}
                        />
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* Conditionally render Academic Year */}
            {showAcadYear && (
                <div className="w-full">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                        Academic Year
                    </label>
                    <select
                        value={acadYear}
                        onChange={(e) => handleFilterChange("acad_year", e.target.value)}
                        disabled={disabled}
                        className={`w-full p-2.5 border border-gray-200 rounded-md text-sm outline-none shadow-sm transition-colors
                            ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white focus:ring-1 focus:border-[#1a6b36] text-gray-800"}`}
                    >
                        {acadYears.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Conditionally render Semester */}
            {showSemester && (
                <div className="w-full">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                        Semester
                    </label>
                    <select
                        value={semester}
                        onChange={(e) => handleFilterChange("semester", e.target.value)}
                        disabled={disabled}
                        className={`w-full p-2.5 border border-gray-200 rounded-md text-sm outline-none shadow-sm transition-colors capitalize
                            ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white focus:ring-1 focus:border-[#1a6b36] text-gray-800"}`}
                    >
                        {semesters.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}