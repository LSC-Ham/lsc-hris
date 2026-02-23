// src/components/hris/settings/SettingsPage.tsx
import CollapsibleSection from "@/components/hris/settings/CollapsibleSection";
import Departments from "@/components/hris/settings/Departments";
import Divisions from "@/components/hris/settings/Divisions";
import Positions from "@/components/hris/settings/Positions";

// ✨ Notice there is no "use client" here anymore!
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

            {/* 2. PAGE CONTENT */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col gap-4">

                    {/* By passing Server Components as 'children' to a Client Component, Next.js stays happy! */}
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