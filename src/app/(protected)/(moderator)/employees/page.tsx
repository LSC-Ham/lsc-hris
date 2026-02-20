// src/app/(protected)/(admin)/employees/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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

export default async function EmployeesLists() {
    const employeesList = await prisma.employees.findMany({
        include: {
            personal_information: {
                select: {
                    firstname: true,
                    middlename: true,
                    surname: true,
                }
            },
            divisions: {
                select: {
                    division: true,
                }
            },
            departments: {
                select: {
                    department: true,
                }
            }
        },
        orderBy: {
            created_at: "desc",
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Employees Directory</h1>
                    <p className="text-sm text-gray-500">Manage and view all employee records.</p>
                </div>
                <Link
                    href="/create"
                    className="bg-[#1a6b36] hover:bg-[#155a2b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm text-center"
                >
                    + Add Employee
                </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    ID Number
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Full Name
                                </th>
                                {/* Hidden on Mobile */}
                                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Division / Dept
                                </th>
                                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Hired At
                                </th>
                                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Updated At
                                </th>
                                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Remarks
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {employeesList.length > 0 ? (
                                employeesList.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {emp.id_number}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {emp.personal_information?.surname}, {emp.personal_information?.firstname} {emp.personal_information?.middlename}
                                            </div>
                                        </td>

                                        {/* Hidden on Mobile: Division & Dept */}
                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {emp.divisions.division}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {emp.departments.department}
                                            </div>
                                        </td>

                                        {/* Hidden on Mobile: Dates */}
                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDateTime(emp.hired_at)}
                                        </td>

                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDateTime(emp.created_at)}
                                        </td>

                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDateTime(emp.updated_at)}
                                        </td>

                                        {/* Hidden on Mobile: Remarks */}
                                        <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                                            {emp.remarks || <span className="text-gray-400 italic">None</span>}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/employees/${emp.id_number}`}
                                                className="text-[#1a6b36] hover:text-[#155a2b] hover:underline"
                                            >
                                                View / Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    {/* Adjusted colSpan for consistency */}
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No employees found. Click "Add Employee" to create one.
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