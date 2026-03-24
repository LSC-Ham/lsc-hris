// src\components\hris\employees\EmployeesTable.tsx
"use client";

import { LoadingSpinner } from "@/components/ui/Loading";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";

// --- RAW SVGS ---
const SearchSVG = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
);

export default function EmployeesTable({
    employeesList,
    defaultQuery = ""
}: {
    employeesList: any[];
    defaultQuery?: string;
}) {
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

    const formatDateTime = (date: Date | null) => {
        if (!date) return "—";
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    };

    const handleRowClick = (idNumber: string) => {
        if (idNumber) router.push(`/hris/employees/${idNumber}`);
    };

    return (
        <div className="flex flex-col w-full">
            {/* --- TABLE HEADER & SEARCH --- */}
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-gray-900 dark:text-zinc-100">Employee List</h3>
                <div className="relative w-full md:max-w-sm">
                    <SearchSVG className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        className="w-full pl-9 pr-10 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b36]/20 focus:border-[#1a6b36] transition-colors shadow-sm text-gray-900 dark:text-zinc-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <LoadingSpinner size="sm" color="gray" />
                        </div>
                    )}
                </div>
            </div>

            {/* --- TABLE CONTENT --- */}
            <div className={`transition-opacity duration-200 ${isSearching ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>

                {/* Mobile View (Cards) */}
                <div className="block md:hidden divide-y divide-gray-100 dark:divide-zinc-800/80 transition-colors duration-300">
                    {employeesList.length > 0 ? (
                        employeesList.map((emp: any) => (
                            <div
                                key={emp.id}
                                onClick={() => handleRowClick(emp.id_number)}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors space-y-3 cursor-pointer"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex flex-col gap-2.5">
                                        <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-lg leading-tight capitalize">
                                            {emp.biography?.personal_information?.surname}, {emp.biography?.personal_information?.firstname} {emp.biography?.personal_information?.middlename}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 text-xs font-semibold shadow-sm transition-colors">
                                                ID: {emp.id_number}
                                            </span>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${emp.employees?.remarks?.toLowerCase() === 'regular' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                                                    emp.employees?.remarks?.toLowerCase() === 'contractual' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                                                        emp.employees?.remarks?.toLowerCase() === 'resigned' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
                                                            'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                                                }`}>
                                                {emp.remarks || "No Status"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm pt-2 border-t border-gray-100 dark:border-zinc-800/80 transition-colors">
                                    <div className="col-span-2">
                                        <span className="text-xs font-semibold opacity-70 text-gray-500 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">Division / Dept</span>
                                        <span className="font-medium text-gray-900 dark:text-zinc-100">{emp.divisions?.division}</span>
                                        <span className="block text-xs text-gray-500 dark:text-zinc-400">{emp.departments?.department}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500 dark:text-zinc-400 text-sm">
                            No employees found {searchTerm ? `matching "${searchTerm}"` : ""}.
                        </div>
                    )}
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden md:block w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800 transition-colors duration-300">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">ID Number</th>
                                <th scope="col" className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Full Name</th>
                                <th scope="col" className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Division / Dept</th>
                                <th scope="col" className="hidden lg:table-cell px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Hired At</th>
                                <th scope="col" className="hidden xl:table-cell px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Created At</th>
                                <th scope="col" className="hidden 2xl:table-cell px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Updated At</th>
                                <th scope="col" className="hidden 2xl:table-cell px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900 transition-colors duration-300">
                            {employeesList.length > 0 ? (
                                employeesList.map((emp: any) => (
                                    <tr
                                        key={emp.id}
                                        onClick={() => handleRowClick(emp.id_number)}
                                        className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase">{emp.id_number}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100 capitalize">
                                                {emp.biography?.personal_information?.surname}, {emp.biography?.personal_information?.firstname} {emp.biography?.personal_information?.middlename}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 dark:text-zinc-300 font-medium">{emp.divisions?.division}</div>
                                            <div className="text-xs text-gray-500 dark:text-zinc-400">{emp.departments?.department}</div>
                                        </td>
                                        <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-500 dark:text-zinc-400">
                                            {formatDateTime(emp.hired_at ?? null)}
                                        </td>
                                        <td className="hidden xl:table-cell px-6 py-4 text-sm text-gray-500 dark:text-zinc-400">
                                            {formatDateTime(emp.created_at ?? null)}
                                        </td>
                                        <td className="hidden 2xl:table-cell px-6 py-4 text-sm text-gray-500 dark:text-zinc-400">
                                            {formatDateTime(emp.updated_at ?? null)}
                                        </td>
                                        <td className="hidden 2xl:table-cell px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${emp.employees?.remarks?.toLowerCase() === 'regular' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                                                    emp.employees?.remarks?.toLowerCase() === 'contractual' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                                                        emp.employees?.remarks?.toLowerCase() === 'resigned' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
                                                            'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                                                }`}>
                                                {emp.remarks || "No Status"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-zinc-400 text-sm">
                                        No employees found {searchTerm ? `matching "${searchTerm}"` : ""}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}