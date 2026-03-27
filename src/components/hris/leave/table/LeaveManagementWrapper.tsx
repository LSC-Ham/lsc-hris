// src/components/hris/leave/table/LeaveManagementWrapper.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import LeaveManagementView, { LeaveRecord } from "./LeaveManagementView";

const CalendarSVG = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
);
const PlaneSVG = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l5.5 4L5 15.5 2.5 15 2 16l3 3 1 .5.5-2.5 3.5-3.5 4 3.5 1.8 1.8c.4.2.7-.2.6-.7Z" /></svg>
);
const StethoscopeSVG = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" /></svg>
);
const AlertTriangleSVG = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
);

const IconMap = {
    calendar: CalendarSVG,
    plane: PlaneSVG,
    stethoscope: StethoscopeSVG,
    alert: AlertTriangleSVG
};

export type IconType = keyof typeof IconMap;

export interface StatConfig {
    label: string;
    value: number;
    iconName: IconType;
    color: string;
    bg: string;
    border: string;
}

interface Props {
    leavesList: LeaveRecord[];
    statsConfig: StatConfig[]; 
    defaultQuery?: string;
    viewRoutePrefix?: string; 
}

export default function LeaveManagementWrapper({
    leavesList,
    statsConfig,
    defaultQuery = "",
    viewRoutePrefix = "/hris/leave/view"
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(defaultQuery);
    const [isPending, startTransition] = useTransition();

    const currentUrlQuery = searchParams.get("query") || "";
    const isSearching = isPending || searchTerm !== currentUrlQuery;

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const currentQuery = searchParams.get("query") || "";
            if (searchTerm === currentQuery) return;

            const params = new URLSearchParams(searchParams);
            if (searchTerm) {
                params.set("query", searchTerm);
            } else {
                params.delete("query");
            }
            params.set("page", "1");

            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, pathname, router, searchParams]);

    const handleRowClick = (id: string | number) => {
        router.push(`${viewRoutePrefix}/${id}`);
    };

    // Map the string iconName to the actual SVG component
    const mappedStats = statsConfig.map(stat => ({
        ...stat,
        icon: IconMap[stat.iconName]
    }));

    return (
        <LeaveManagementView
            leavesList={leavesList}
            stats={mappedStats}
            searchTerm={searchTerm}
            isSearching={isSearching}
            onSearchChange={setSearchTerm}
            onRowClick={handleRowClick}
        />
    );
}