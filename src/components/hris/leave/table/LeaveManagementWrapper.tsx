"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import LeaveManagementView, { 
    LeaveRecord, 
    CalendarSVG, 
    AlertTriangleSVG, 
    PlaneSVG, 
    StethoscopeSVG 
} from "./LeaveManagementView";

interface Props {
    leavesList: LeaveRecord[];
    defaultQuery?: string;
}

export default function LeaveManagementWrapper({ leavesList, defaultQuery = "" }: Props) {
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
        router.push(`/hris/leave/view/${id}`);
    };

    let countPending = 0;
    let countApproved = 0;
    let countRejected = 0;

    leavesList.forEach((leave) => {
        if (leave.status === 1 || leave.status === 2) countPending++;
        else if (leave.status === 3) countApproved++;
        else if (leave.status === 0) countRejected++;
    });

    const stats = [
        { label: "Listed Leaves", value: leavesList.length, icon: CalendarSVG, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-100 dark:border-blue-800/50" },
        { label: "Pending", value: countPending, icon: AlertTriangleSVG, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-100 dark:border-amber-800/50" },
        { label: "Approved", value: countApproved, icon: PlaneSVG, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-800/50" },
        { label: "Rejected", value: countRejected, icon: StethoscopeSVG, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-100 dark:border-rose-800/50" }
    ];

    return (
        <LeaveManagementView
            leavesList={leavesList}
            stats={stats}
            searchTerm={searchTerm}
            isSearching={isSearching}
            onSearchChange={setSearchTerm}
            onRowClick={handleRowClick}
        />
    );
}