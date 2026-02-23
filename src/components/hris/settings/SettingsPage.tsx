"use client";

import { useState } from "react";
import Departments from "@/components/hris/settings/Departments";
import Divisions from "@/components/hris/settings/Divisions";
import Positions from "@/components/hris/settings/Positions";

// ✨ Helper Component: Handles the click-to-hide/show logic
function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* The clickable header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none"
            >
                <h3 className="text-gray-900 font-medium">{title}</h3>

                {/* Chevron icon that rotates when open */}
                <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* The content that hides/shows */}
            <div
                className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="p-4 bg-white border-t border-gray-200">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Removed "async" because client components with useState cannot be async
export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* 1. PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        HRIS Settings
                    </h1>
                    <p className="text-sm text-gray-500">
                        Modify your System Settings
                    </p>
                </div>
            </div>

            {/* 2. PAGE CONTENT - Wrapped in our new CollapsibleSection */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col gap-4">

                    <CollapsibleSection title="Divisions">
                        <Divisions />
                    </CollapsibleSection>

                    <CollapsibleSection title="Departments">
                        <Departments />
                    </CollapsibleSection>

                    <CollapsibleSection title="Positions">
                        <Positions />
                    </CollapsibleSection>

                </div>
            </div>
        </div>
    );
}