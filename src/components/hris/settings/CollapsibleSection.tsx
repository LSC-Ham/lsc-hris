// src/components/hris/settings/CollapsibleSection.tsx
"use client";

import { useState } from "react";

export default function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-zinc-950/50 hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6b36]"
            >
                <h3 className="text-gray-900 dark:text-zinc-100 font-medium">{title}</h3>
                <svg
                    className={`w-5 h-5 text-gray-500 dark:text-zinc-400 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
                    {children}
                </div>
            </div>
        </div>
    );
}