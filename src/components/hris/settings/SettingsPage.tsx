// src/components/hris/settings/SettingsPage.tsx
"use client";

import CollapsibleSection from "@/components/hris/settings/CollapsibleSection";
import Departments from "./Departments";
import Divisions from "./Divisions";
import Positions from "./Positions";
// import DivisionsTemplate from "@/components/hris/settings/DivisionsTemplate"; // For later
// import PositionsTemplate from "@/components/hris/settings/PositionsTemplate"; // For later

// Define the shape of the props coming from your Server Page
interface SettingsPageProps {
    divisions: any[];
    departments: any[];
    positions: any[];
}

export default function SettingsPage({ divisions, departments, positions }: SettingsPageProps) {
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

            {/* 2. PAGE CONTENT */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col gap-4">

                    {/* Divisions (Placeholder for when you make DivisionsTemplate) */}
                    <CollapsibleSection title="Divisions">
                        <Divisions data={divisions} />
                        {/* <DivisionsTemplate data={divisions} /> */}
                    </CollapsibleSection>

                    {/* Departments - Now passing the data into the template! */}
                    <CollapsibleSection title="Departments">
                        <Departments data={departments} />
                    </CollapsibleSection>

                    {/* Positions (Placeholder for when you make PositionsTemplate) */}
                    <CollapsibleSection title="Positions">
                        <Positions data={positions} />
                    </CollapsibleSection>

                </div>
            </div>
        </div>
    );
}