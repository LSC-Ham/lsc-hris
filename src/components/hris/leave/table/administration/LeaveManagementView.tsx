// src\app\hris\(protected)\(user)\leave\[id_number]\LeaveManagementView.tsx
"use client";

import { LoadingSpinner } from "@/components/ui/Loading";

export interface LeaveRecord {
    id: string | number;
    leave_type: string;
    reason: string | null;
    status: number | null;
    date: Date | string | null;
    time_from: Date | string | null;
    time_to: Date | string | null;
    created_at: Date | string | null;
    employees?: {
        biography?: {
            personal_information?: {
                firstname: string | null;
                surname: string | null;
            } | null;
        } | null;
        departments?: {
            department: string | null;
        } | null;
    } | null;
}

export interface LeaveStat {
    label: string;
    value: number;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
}

interface Props {
    leavesList: LeaveRecord[];
    stats: LeaveStat[];
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    isSearching?: boolean;
    onRowClick?: (id: string | number) => void;
}

const SearchSVG = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
);

export default function LeaveManagementView({
    leavesList,
    stats,
    searchTerm = "",
    onSearchChange,
    isSearching = false,
    onRowClick
}: Props) {

    const formatDate = (date: Date | string | null) => {
        if (!date) return "—";
        return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
    };

    const formatTime = (time: Date | string | null) => {
        if (!time) return "—";
        return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(time));
    };

    const getEmployeeName = (leave: LeaveRecord) => {
        const info = leave.employees?.biography?.personal_information;
        if (info?.firstname && info?.surname) {
            return `${info.firstname} ${info.surname}`;
        }
        return "";
    };

    const getDepartmentName = (leave: LeaveRecord) => {
        return leave.employees?.departments?.department || "";
    };

    const getStatusDetails = (status: number | null) => {
        switch (status) {
            case null:
                return { label: "Pending Head", style: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700" };
            case 0:
                return { label: "Declined by Head", style: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" };
            case 1:
                return { label: "Pending VP", style: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" };
            case 2:
                return { label: "Declined by VP", style: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" };
            case 3:
                return { label: "Fully Approved", style: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" };
            default:
                return { label: "Pending", style: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" };
        }
    };

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
                    <h3 className="font-bold text-gray-900 dark:text-zinc-100">Leave Requests</h3>
                    <div className="relative w-full md:max-w-sm">
                        <SearchSVG className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or leave type..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange?.(e.target.value)}
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
                                    <div
                                        key={leave.id}
                                        onClick={() => onRowClick?.(leave.id)}
                                        className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors space-y-3 cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-lg leading-tight capitalize">
                                                    {getEmployeeName(leave)}
                                                </h3>
                                                {/* Department added here for mobile */}
                                                <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
                                                    {getDepartmentName(leave)}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm font-semibold text-[#1a6b36] dark:text-[#208242] capitalize">{leave.leave_type}</span>
                                                </div>
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
                                    <th scope="col" className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Employee</th>
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
                                            <tr
                                                key={leave.id}
                                                onClick={() => onRowClick?.(leave.id)}
                                                className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-zinc-100 capitalize">{getEmployeeName(leave)}</div>
                                                    {/* Department added here for desktop */}
                                                    <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{getDepartmentName(leave)}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-zinc-100 capitalize">{leave.leave_type}</div>
                                                    <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 font-mono truncate max-w-[200px]">Reason: {leave.reason || "—"}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">{formatDate(leave.date)}</div>
                                                    <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                                                        {formatTime(leave.time_from)} <span className="mx-1">→</span> {formatTime(leave.time_to)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">1</div>
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
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-zinc-400 text-sm">
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