"use client";

import { useRouter } from "next/navigation";

export default function EmployeesTable({ employeesList }: { employeesList: any[] }) {
    const router = useRouter();

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
        if (idNumber) {
            router.push(`/hris/employees/${idNumber}`);
        }
    };

    return (
        <>
            {/* Mobile View (Card Layout) */}
            <div className="block md:hidden divide-y divide-gray-200 dark:divide-zinc-800 transition-colors duration-300">
                {employeesList.length > 0 ? (
                    employeesList.map((emp: any) => (
                        <div
                            key={emp.id}
                            onClick={() => handleRowClick(emp.id_number)}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors space-y-3 cursor-pointer"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex flex-col gap-2.5">
                                    <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-lg leading-tight capitalize">
                                        {emp.biography?.personal_information?.surname}, {emp.biography?.personal_information?.firstname} {emp.biography?.personal_information?.middlename}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 text-xs font-semibold shadow-sm transition-colors">
                                            ID: {emp.id_number}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold shadow-sm border transition-colors
                                                ${emp.employees?.remarks?.toLowerCase() === 'regular' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' :
                                                emp.employees?.remarks?.toLowerCase() === 'contractual' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                                                    emp.employees?.remarks?.toLowerCase() === 'resigned' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
                                                        'bg-slate-50 text-gray-500 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'}`}
                                        >
                                            {emp.remarks || "No Status"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm pt-2 border-t border-gray-200 dark:border-zinc-800 transition-colors">
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
                        No employees found.
                    </div>
                )}
            </div>

            {/* Desktop View (Table Layout) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-zinc-800 transition-colors duration-300">
                    <thead className="bg-slate-50 dark:bg-zinc-900/50 transition-colors duration-300">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">ID Number</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Full Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Division / Dept</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Hired At</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Created At</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Updated At</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800 capitalize transition-colors duration-300">
                        {employeesList.length > 0 ? (
                            employeesList.map((emp: any) => (
                                <tr
                                    key={emp.id}
                                    onClick={() => handleRowClick(emp.id_number)}
                                    className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase">{emp.id_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-zinc-100 font-medium capitalize">
                                            {emp.biography?.personal_information?.surname}, {emp.biography?.personal_information?.firstname} {emp.biography?.personal_information?.middlename}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-zinc-100 font-medium">{emp.divisions?.division}</div>
                                        <div className="text-xs text-gray-500 dark:text-zinc-400">{emp.departments?.department}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">{formatDateTime(emp.hired_at ?? null)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">{formatDateTime(emp.created_at ?? null)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">{formatDateTime(emp.updated_at ?? null)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-zinc-400 max-w-[200px] truncate">
                                        {emp.remarks || <span className="opacity-70 italic">None</span>}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-zinc-400 text-sm">
                                    No employees found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}