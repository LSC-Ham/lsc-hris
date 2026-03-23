// src\app\hris\(protected)\(human-resource)\departments\page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DepartmentsPage() {
    // Highly optimized query: just gets the department and the COUNT of employees
    const departments = await prisma.departments.findMany({
        select: {
            id: true,
            department: true,
            _count: {
                select: { employees: true }
            }
        },
        orderBy: { department: 'asc' }
    });

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-100 tracking-tight transition-colors">
                        Departments Overview
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors">
                        View all company departments and their current headcount.
                    </p>
                </div>

                <Link
                    href="./departments/create"
                    className="bg-[#1a6b36] hover:bg-[#134d26] dark:hover:bg-[#114020] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm text-center w-full md:w-auto"
                >
                    + Add Department
                </Link>
            </div>

            {/* Clean Dashboard-Style Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {departments.length > 0 ? (
                    departments.map((dept) => (
                        <Link
                            href={`/hris/departments/${encodeURIComponent(dept.department)}`}
                            key={dept.id}
                            className="group bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-zinc-950/80 hover:border-[#1a6b36]/40 dark:hover:border-[#28a152]/40 h-full min-h-[160px]"
                        >
                            {/* Icon & Department Name */}
                            <div>
                                <div className="w-10 h-10 bg-[#1a6b36]/10 dark:bg-[#1a6b36]/20 text-[#1a6b36] dark:text-[#28a152] rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-[#1a6b36] group-hover:text-white dark:group-hover:bg-[#28a152] dark:group-hover:text-zinc-900">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 capitalize leading-tight line-clamp-2 transition-colors group-hover:text-[#1a6b36] dark:group-hover:text-[#28a152]">
                                    {dept.department}
                                </h2>
                            </div>

                            {/* Employee Count Footer */}
                            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between transition-colors">
                                <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">
                                    Total Employees
                                </span>
                                <span className="text-lg font-bold text-[#1a6b36] dark:text-[#28a152] bg-[#1a6b36]/10 dark:bg-[#1a6b36]/20 px-3 py-0.5 rounded-full transition-colors">
                                    {dept._count.employees}
                                </span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-12 text-center transition-colors">
                        <p className="text-sm text-gray-500 dark:text-zinc-400 italic">No departments found. Create one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}