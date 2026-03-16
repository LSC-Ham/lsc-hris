import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
    const [totalUsers, totalLoggedIn, recentUsers, departments] = await Promise.all([
        prisma.user.count(),

        prisma.user.count({
            where: { password_changed: true }
        }),

        prisma.user.findMany({
            take: 10,
            select: {
                id: true,
                role: true,
                created_at: true,
                password_changed: true,
                biography: {
                    select: {
                        personal_information: {
                            select: { firstname: true, surname: true }
                        }
                    }
                }
            },
            orderBy: { updated_at: 'desc' }
        }),

        prisma.departments.findMany({
            take: 5,
            select: {
                id: true,
                department: true,
                created_at: true,
            }
        })
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-sm text-gray-500">
                        A quick glance at current HRIS statistics and reports.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 transition-shadow hover:shadow-md h-full">
                        <div className="p-4 bg-[#1a6b36]/10 text-[#1a6b36] rounded-xl">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Total Users
                            </p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {totalUsers}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 transition-shadow hover:shadow-md h-full">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Logged In
                            </p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {totalLoggedIn}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-shadow hover:shadow-md flex flex-col">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
                        </svg>
                        Departments
                    </p>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                        {departments.map((dept) => (
                            <div key={dept.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0 capitalize">
                                <p className="text-sm font-semibold text-gray-800 truncate pr-4">
                                    {dept.department}
                                </p>
                                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full whitespace-nowrap">
                                    {dept.created_at.toLocaleDateString()}
                                </span>
                            </div>
                        ))}

                        {departments.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No departments found.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-shadow hover:shadow-md flex flex-col row-span-2">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Activation Status
                    </p>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                        {recentUsers.map((user) => {
                            const firstName = user.biography?.personal_information?.firstname || "";
                            const lastName = user.biography?.personal_information?.surname || "";

                            return (
                                <div key={user.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0 capitalize">
                                    <p className="text-sm font-semibold text-gray-800 truncate pr-4">
                                        {firstName} {lastName}
                                    </p>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap border ${user.password_changed
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                        }`}>
                                        {user.password_changed ? "Active" : "Pending"}
                                    </span>
                                </div>
                            );
                        })}

                        {recentUsers.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No users found.</p>
                        )}
                    </div>
                </div>

                <div className="sm:col-span-2 lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-shadow hover:shadow-md flex flex-col">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Recent Registrations
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        {recentUsers.map((user) => {
                            const firstName = user.biography?.personal_information?.firstname || "";
                            const lastName = user.biography?.personal_information?.surname || "";

                            return (
                                <div key={user.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 md:[&:nth-last-child(-n+2)]:border-0 md:[&:nth-last-child(-n+2)]:pb-0 capitalize">
                                    <p className="text-sm font-semibold text-gray-800 truncate pr-4">
                                        {firstName} {lastName}
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full whitespace-nowrap">
                                            {user.role}
                                        </span>
                                        <span className="text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full whitespace-nowrap hidden sm:inline-block">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {recentUsers.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No users found.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}