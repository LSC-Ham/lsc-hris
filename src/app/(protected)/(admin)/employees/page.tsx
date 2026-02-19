// src/app/(protected)/(admin)/employees/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

// Helper to format dates with the timestamp (Date + Time)
const formatDateTime = (date: Date | null) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true, // e.g., "Feb 19, 2026, 2:30 PM"
    }).format(date);
};

export default async function EmployeesLists() {
    // Fetch employees and include related division/department data
    const employeesList = await prisma.employees.findMany({
        include: {
            divisions: true, // Allows us to access employee.divisions.name
            departments: true, // Allows us to access employee.departments.name
        },
        orderBy: {
            created_at: "desc", // Show newest first
        },
    });

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Employees Directory</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and view all employee records.</p>
                </div>
                <Link
                    href="/employees/create"
                    className="bg-[#1a6b36] hover:bg-[#155a2b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    + Add Employee
                </Link>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    ID Number
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Division / Dept
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Hired At
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Updated At
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
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
                                        {/* ID Number */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {emp.id_number}
                                        </td>

                                        {/* Division & Department */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {(emp.divisions as any)?.name || emp.divisions_id}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {(emp.departments as any)?.name || emp.departments_id}
                                            </div>
                                        </td>

                                        {/* Hired Date */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDateTime(emp.hired_at)}
                                        </td>

                                        {/* Created At */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDateTime(emp.created_at)}
                                        </td>

                                        {/* Updated At (Now includes time) */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDateTime(emp.updated_at)}
                                        </td>

                                        {/* Remarks */}
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                                            {emp.remarks || <span className="text-gray-400 italic">None</span>}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/employees/${emp.id}`}
                                                className="text-[#1a6b36] hover:text-[#155a2b] hover:underline"
                                            >
                                                View / Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
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