import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
    // Fetch all queries simultaneously for maximum performance
    const [students, totalUsers] = await Promise.all([
        // 1. Total Employees
        prisma.students.findMany({
            distinct: ['id_number'],
            include: {
                biography: {
                    select: {
                        personal_information: {
                            select: {
                                firstname: true,
                                middlename: true,
                                surname: true,
                                mobile_no: true,
                            }
                        },
                    }
                }
            },
            orderBy: {
                created_at: "desc",
            },
        }),
        prisma.user.count(),

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
                        A quick glance at current SMS statistics and reports.
                    </p>
                </div>
            </div>

            {/* 2. PAGE CONTENT - Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* COLUMN 1: Key Metrics */}
                <div className="flex flex-col gap-6">
                    {/* Total Employees Card */}
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
                    {/* Total Employees Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4 transition-shadow hover:shadow-md h-full">
                        <div className="p-4 bg-[#1a6b36]/10 text-[#1a6b36] rounded-xl">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Total Students
                            </p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {students.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}