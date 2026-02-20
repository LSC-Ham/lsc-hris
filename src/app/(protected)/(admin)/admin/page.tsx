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

export default async function UsersLists() {
    // Fetch employees and include related division/department data
    const usersLists = await prisma.user.findMany({
        include: {
            employees: {
                // Use ONLY 'select' here
                select: {
                    id_number: true,
                    // Put the relation directly inside the select!
                    personal_information: {
                        select: {
                            surname: true,
                            firstname: true,
                            middlename: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            created_at: "desc", // Show newest first
        },
    });

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users Directory</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and view all users records.</p>
                </div>
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
                                    Full Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Updated At
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Logged In
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {usersLists.length > 0 ? (
                                usersLists.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        {/* ID Number */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {user.employees?.id_number}
                                        </td>

                                        {/* Full Name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.employees?.personal_information?.surname}, {user.employees?.personal_information?.firstname} {user.employees?.personal_information?.middlename}
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.role}
                                        </td>

                                        {/* Created At */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDateTime(user.created_at)}
                                        </td>

                                        {/* Updated At (Now includes time) */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDateTime(user.updated_at)}
                                        </td>

                                        {/* Logged In */}
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                                            {user.password_changed ? "Yes" : "No"}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/users/${user.employees?.id_number}`}
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