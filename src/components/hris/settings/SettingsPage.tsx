// src/components/hris/settings/SettingsPage.tsx
"use client";

import CollapsibleSection from "@/components/hris/settings/CollapsibleSection";
import Departments from "./Departments";
import Divisions from "./Divisions";
import Positions from "./Positions";

interface SettingsPageProps {
    divisions: any[];
    departments: any[];
    positions: any[];
}

export default function SettingsPage({ divisions, departments, positions }: SettingsPageProps) {
    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-100 tracking-tight">
                        HRIS Settings
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                        Modify your System Settings
                    </p>
                </div>
            </div>

            <div className="rounded-xl border-gray-200 dark:border-zinc-800">
                <div className="flex flex-col gap-4">

                    <CollapsibleSection title="Divisions">
                        <Divisions data={divisions} />
                    </CollapsibleSection>

                    <CollapsibleSection title="Departments">
                        <Departments data={departments} />
                    </CollapsibleSection>

                    <CollapsibleSection title="Positions">
                        <Positions data={positions} departments={departments} />
                    </CollapsibleSection>

                </div>
            </div>
        </div>
    );
}