// src\app\hris\(protected)\(user)\leave\[id_number]\LeaveManagementPage.tsx
"use client";

import { LoadingSpinner } from "@/components/ui/Loading";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";

interface Props {
    leavesList: any[];
    defaultQuery?: string;
}

const CalendarSVG = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
);

const PlaneSVG = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l5.5 4L5 15.5 2.5 15 2 16l3 3 1 .5.5-2.5 3.5-3.5 4 3.5 1.8 1.8c.4.2.7-.2.6-.7Z" />
    </svg>
);

const StethoscopeSVG = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
    </svg>
);

const AlertTriangleSVG = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
);

const SearchSVG = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
);

export default function LeaveManagementPage({ leavesList, defaultQuery = "" }: Props) {
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

    const formatDate = (date: Date | string | null) => {
        if (!date) return "—";
        return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
    };

    const formatTime = (time: Date | string | null) => {
        if (!time) return "—";
        return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(time));
    };

    const getStatusDetails = (status: number | null) => {
        switch (status) {
            case 0:
                return {
                    label: "Rejected",
                    style: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                };
            case 1:
            case 2:
                return {
                    label: "Pending",
                    style: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                };
            case 3:
                return {
                    label: "Approved",
                    style: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                };
            default:
                return {
                    label: "Unknown",
                    style: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                };
        }
    };

    const INITIAL_VL = 5;
    const INITIAL_SL = 5;
    const INITIAL_EL = 3;

    let usedVL = 0;
    let usedSL = 0;
    let usedEL = 0;

    leavesList.forEach((leave) => {
        if (leave.status === 1 || leave.status === 2 || leave.status === 3) {
            const type = (leave.leave_type || "").toLowerCase();

            if (type.includes("vacation")) {
                usedVL += 1;
            } else if (type.includes("sick")) {
                usedSL += 1;
            } else if (type.includes("emergency")) {
                usedEL += 1;
            }
        }
    });

    const balanceVL = Math.max(0, INITIAL_VL - usedVL);
    const balanceSL = Math.max(0, INITIAL_SL - usedSL);
    const balanceEL = Math.max(0, INITIAL_EL - usedEL);
    const balanceTotal = balanceVL + balanceSL + balanceEL;

    const stats = [
        { label: "Total Leave", value: balanceTotal, icon: CalendarSVG, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-100 dark:border-blue-800/50" },
        { label: "Vacation Leave", value: balanceVL, icon: PlaneSVG, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-800/50" },
        { label: "Sick Leave", value: balanceSL, icon: StethoscopeSVG, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-100 dark:border-amber-800/50" },
        { label: "Emergency Leave", value: balanceEL, icon: AlertTriangleSVG, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-100 dark:border-rose-800/50" }
    ];

    return (
        <div className="space-y-6 flex flex-col w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className={`p-5 rounded-xl border ${stat.border} ${stat.bg} transition-all duration-300 hover:scale-[1.02]`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg bg-white dark:bg-zinc-900 shadow-sm`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Credits</span>
                        </div>
                        <div>
                            <span className="text-3xl font-black text-gray-900 dark:text-zinc-100">{stat.value}</span>
                            <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mt-1">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-t-xl overflow-hidden flex flex-col w-full">
                <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 dark:bg-zinc-900/50">
                    <h3 className="font-bold text-gray-900 dark:text-zinc-100">Leave History</h3>
                    <div className="relative w-full md:max-w-sm">
                        <SearchSVG className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by leave type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-10 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b36]/20 focus:border-[#1a6b36] transition-colors shadow-sm text-gray-900 dark:text-zinc-100"
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <LoadingSpinner size="sm" color="gray" />
                            </div>
                        )}
                    </div>
                </div>

                <div className={`transition-opacity duration-200 ${isSearching ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                    {/* MOBILE VIEW */}
                    <div className="block md:hidden divide-y divide-gray-100 dark:divide-zinc-800/80 transition-colors duration-300">
                        {leavesList.length > 0 ? (
                            leavesList.map((leave) => {
                                const status = getStatusDetails(leave.status);
                                return (
                                    <div key={leave.id} className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors space-y-3 cursor-pointer">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-lg leading-tight capitalize">
                                                    {leave.leave_type}
                                                </h3>
                                                <span className="text-xs text-gray-400 dark:text-zinc-500 font-mono">Reason: {leave.reason || "None provided"}</span>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border whitespace-nowrap ${status.style}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm pt-2 border-t border-gray-100 dark:border-zinc-800/80 transition-colors">
                                            <div>
                                                <span className="text-xs font-semibold opacity-70 text-gray-500 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">Date & Time</span>
                                                <span className="font-bold text-gray-900 dark:text-zinc-100">{formatDate(leave.date)}</span>
                                                <span className="block text-xs text-gray-500 dark:text-zinc-400">{formatTime(leave.time_from)} - {formatTime(leave.time_to)}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs font-semibold opacity-70 text-gray-500 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">Details</span>
                                                <span className="font-bold text-gray-900 dark:text-zinc-100">1 Day</span>
                                                <span className="block text-xs text-gray-500 dark:text-zinc-400">Filed: {formatDate(leave.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-gray-500 dark:text-zinc-400 text-sm">
                                No leave records found {searchTerm ? `matching "${searchTerm}"` : ""}.
                            </div>
                        )}
                    </div>

                    {/* DESKTOP VIEW */}
                    <div className="hidden md:block w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800 transition-colors duration-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Leave Type</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Date & Time</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Days</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Date Filed</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900 transition-colors duration-300">
                                {leavesList.length > 0 ? (
                                    leavesList.map((leave) => {
                                        const status = getStatusDetails(leave.status);
                                        return (
                                            <tr key={leave.id}
                                                onClick={() => router.push(`/hris/leave/view/${leave.id}`)}
                                                className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-zinc-100 capitalize">{leave.leave_type}</div>
                                                    <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 font-mono truncate max-w-[200px]">Reason: {leave.reason || "—"}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                                                        {formatDate(leave.date)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                                                        {formatTime(leave.time_from)} <span className="mx-1">→</span> {formatTime(leave.time_to)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                                                        1
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${status.style}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-500 dark:text-zinc-400">{formatDate(leave.created_at)}</div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-zinc-400 text-sm">
                                            No leave records found {searchTerm ? `matching "${searchTerm}"` : ""}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}