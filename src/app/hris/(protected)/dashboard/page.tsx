import { prisma } from "@/lib/prisma";

export default async function Home() {
    // Fetch all counts simultaneously for maximum performance
    const [totalEmployees, adminEmployees, academicEmployees] = await Promise.all([
        // 1. Total Employees
        prisma.employees.count(),

        // 2. Employees in Administration
        prisma.employees.count({
            where: {
                divisions: {
                    // Note: Change "name" to whatever your division column is actually called (e.g., title, division_name)
                    division: "Administration"
                }
            }
        }),

        // 3. Employees in Academics
        prisma.employees.count({
            where: {
                divisions: {
                    division: "Academics"
                }
            }
        })
    ]);

    return (
        <div className="space-y-6">
            {/* 1. PAGE HEADER */}
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

            {/* 2. PAGE CONTENT - Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Total Employees Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 transition-shadow hover:shadow-md">
                    <div className="p-4 bg-[#1a6b36]/10 text-[#1a6b36] rounded-xl">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Total Employees
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            {totalEmployees}
                        </p>
                    </div>
                </div>

                {/* Administration Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 transition-shadow hover:shadow-md">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Administration
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            {adminEmployees}
                        </p>
                    </div>
                </div>

                {/* Academics Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 transition-shadow hover:shadow-md">
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-xl">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Academics
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            {academicEmployees}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}