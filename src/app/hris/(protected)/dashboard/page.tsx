import { prisma } from "@/lib/prisma";

export default async function Page() {
    const [
        totalEmployees,
        totalLeaves,
        totalDepartments,
        recentEmployees,
        recentLeaves,
        leaveTypeGroups
    ] = await Promise.all([
        prisma.employees.count(),
        prisma.employees_leaves.count(),
        prisma.departments.count(),

        prisma.employees.findMany({
            take: 5,
            select: {
                id: true,
                created_at: true,
                departments: { select: { department: true } },
                biography: {
                    select: {
                        personal_information: {
                            select: { firstname: true, surname: true }
                        }
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        }),

        prisma.employees_leaves.findMany({
            take: 5,
            select: {
                id: true,
                leave_type: true,
                date: true,
                status: true,
                employees: {
                    select: {
                        biography: {
                            select: {
                                personal_information: {
                                    select: { firstname: true, surname: true }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        }),

        prisma.employees_leaves.groupBy({
            by: ['leave_type'],
            _count: { leave_type: true },
            orderBy: { _count: { leave_type: 'desc' } },
            take: 5,
        })
    ]);

    const getStatusDisplay = (status: number | null) => {
        if (status === 1) return { label: 'Approved', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' };
        if (status === 2) return { label: 'Rejected', classes: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' };
        return { label: 'Pending', classes: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' };
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight transition-colors">
                        HRIS Overview
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors">
                        A comprehensive summary of employees, departments, and leave requests.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider transition-colors">
                            Total Employees
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mt-1 transition-colors">
                            {totalEmployees}
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-4 bg-[#1a6b36]/10 dark:bg-[#1a6b36]/20 text-[#1a6b36] dark:text-emerald-400 rounded-xl transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider transition-colors">
                            Leaves Filed
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mt-1 transition-colors">
                            {totalLeaves}
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider transition-colors">
                            Departments
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mt-1 transition-colors">
                            {totalDepartments}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 transition-all hover:shadow-md flex flex-col">
                    <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Newest Employees
                    </p>
                    <div className="space-y-4 flex-1 overflow-y-auto">
                        {recentEmployees.map((emp) => {
                            const firstName = emp.biography?.personal_information?.firstname || "";
                            const lastName = emp.biography?.personal_information?.surname || "";
                            return (
                                <div key={emp.id} className="flex flex-col border-b border-gray-100 dark:border-zinc-800/80 pb-3 last:border-0 last:pb-0 capitalize transition-colors">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate">
                                        {firstName} {lastName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 px-2 py-0.5 rounded-md truncate transition-colors">
                                            {emp.departments?.department || "No Dept"}
                                        </span>
                                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 whitespace-nowrap">
                                            {new Date(emp.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {recentEmployees.length === 0 && <p className="text-sm text-gray-500 dark:text-zinc-400 italic">No users found.</p>}
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 transition-all hover:shadow-md flex flex-col">
                    <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#1a6b36] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Recent Leaves
                    </p>
                    <div className="space-y-4 flex-1 overflow-y-auto">
                        {recentLeaves.map((leave) => {
                            const firstName = leave.employees?.biography?.personal_information?.firstname || "";
                            const lastName = leave.employees?.biography?.personal_information?.surname || "";
                            const { label: statusLabel, classes: statusClasses } = getStatusDisplay(leave.status);

                            return (
                                <div key={leave.id} className="flex flex-col border-b border-gray-100 dark:border-zinc-800/80 pb-3 last:border-0 last:pb-0 capitalize transition-colors">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate pr-2">
                                            {firstName} {lastName}
                                        </p>
                                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-md uppercase tracking-wider transition-colors ${statusClasses}`}>
                                            {statusLabel}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 px-2 py-0.5 rounded-md whitespace-nowrap transition-colors">
                                            {leave.leave_type.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 whitespace-nowrap">
                                            {leave.date ? new Date(leave.date).toLocaleDateString() : 'No date'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {recentLeaves.length === 0 && <p className="text-sm text-gray-500 dark:text-zinc-400 italic">No recent leaves.</p>}
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 transition-all hover:shadow-md flex flex-col">
                    <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                        Top Leave Types
                    </p>
                    <div className="space-y-4 flex-1 overflow-y-auto">
                        {leaveTypeGroups.map((group, index) => (
                            <div key={index} className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/80 pb-3 last:border-0 last:pb-0 capitalize transition-colors">
                                <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate pr-4">
                                    {group.leave_type.replace(/_/g, ' ')}
                                </p>
                                <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors">
                                    {group._count.leave_type} reqs
                                </span>
                            </div>
                        ))}
                        {leaveTypeGroups.length === 0 && <p className="text-sm text-gray-500 dark:text-zinc-400 italic">No leave data found.</p>}
                    </div>
                </div>

            </div>
        </div>
    );
}