// src\app\hris\(protected)\(human-resource)\departments\[department]\page.tsx
import EmployeeDropdownCard from "@/components/hris/employees/EmployeeDropdownCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ department: string }>;
}) {
    const { department: department } = await params;
    const departmentName = decodeURIComponent(department);

    const departmentData = await prisma.departments.findUnique({
        where: {
            department: departmentName
        },
        include: {
            employees: {
                select: {
                    id: true,
                    id_number: true,
                    created_at: true,
                    department_role: true,
                    biography: {
                        select: {
                            users: {
                                select: {
                                    id: true,
                                    profile_picture: true,
                                }
                            },
                            personal_information: {
                                select: {
                                    firstname: true,
                                    surname: true
                                }
                            }
                        }
                    }
                },
                orderBy: [
                    {
                        ranks: {
                            order: 'desc'
                        }
                    },
                    {
                        created_at: 'desc'
                    }
                ] // Newest employees first
            }
        }
    });

    // 3. If someone types a random department in the URL that doesn't exist, show a 404
    if (!departmentData) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Top Navigation / Back Button */}
            <div>
                <Link
                    href="/hris/departments"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#1a6b36] dark:text-zinc-400 dark:hover:text-[#28a152] transition-colors"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Departments
                </Link>
            </div>

            {/* Department Header */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#1a6b36]/10 dark:bg-[#1a6b36]/20 text-[#1a6b36] dark:text-[#28a152] rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 capitalize tracking-tight">
                                {departmentData.department}
                            </h1>
                            {departmentData.description ? (
                                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 max-w-2xl">
                                    {departmentData.description}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 italic">
                                    No description provided.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Headcount Badge */}
                    <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-4 py-2 rounded-lg flex flex-col items-center justify-center min-w-[100px]">
                        <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                            Headcount
                        </span>
                        <span className="text-2xl font-bold text-[#1a6b36] dark:text-[#28a152]">
                            {departmentData.employees.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Employee List Grid */}
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">
                    Team Members
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 italic">
                    * Note: Heads and Assistant Heads are granted administrative control over departmental leave approvals.
                </p>

                {departmentData.employees.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {departmentData.employees.map((emp) => {
                            const firstName = emp.biography?.personal_information?.firstname || "Unknown";
                            const lastName = emp.biography?.personal_information?.surname || "Employee";

                            return (
                                <EmployeeDropdownCard
                                    key={emp.id}
                                    id_number={emp.id_number}
                                    firstName={firstName}
                                    lastName={lastName}
                                    userId={emp.biography.users?.id || ""}
                                    profilePicture={emp.biography.users?.profile_picture || ""}
                                    joinedDate={new Date(emp.created_at).toLocaleDateString()}
                                    departmentName={departmentData.department}
                                    currentRole={emp.department_role}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 p-12 text-center">
                        <div className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto mb-3">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">No employees assigned</h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                            There is currently no one assigned to the {departmentData.department} department.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}