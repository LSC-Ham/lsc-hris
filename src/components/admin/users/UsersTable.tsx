"use client";

import { useRouter } from "next/navigation";

export default function UsersTable({ usersLists }: { usersLists: any[] }) {
    const router = useRouter();

    // Helper to format dates with the timestamp (Date + Time)
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

    const handleRowClick = (id: string) => {
        if (id) {
            router.push(`/admin/users/${id}`);
        }
    };

    return (
        <>
            {/* 📱 MOBILE VIEW: Card Layout */}
            <div className="block md:hidden divide-y divide-gray-100">
                {usersLists.length > 0 ? (
                    usersLists.map((user: any) => (
                        <div
                            key={user.id}
                            onClick={() => handleRowClick(user.id)}
                            className="p-4 hover:bg-gray-50 transition-colors space-y-3 cursor-pointer">
                            {/* Card Header */}
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex flex-col gap-2.5">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight capitalize">
                                        {user.biography?.personal_information?.surname}, {user.biography?.personal_information?.firstname} {user.biography?.personal_information?.middlename}
                                    </h3>

                                    {/* Badges Container */}
                                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold shadow-sm">
                                            ID: {user.biography?.employees?.id_number || "—"}
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold shadow-sm">
                                            {user.role || "No Role"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-600 pt-2 border-t border-gray-50">
                                <div className="col-span-1">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">Logged In</span>
                                    <span className="font-medium text-gray-800">
                                        {user.password_changed ? (
                                            <span className="text-green-600 font-medium">Yes</span>
                                        ) : (
                                            <span className="text-gray-400">No</span>
                                        )}
                                    </span>
                                </div>
                                <div className="col-span-1">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">Created At</span>
                                    <span className="font-medium text-gray-800">{formatDateTime(user.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No users found.
                    </div>
                )}
            </div>

            {/* 💻 DESKTOP VIEW: Full Original Table Layout */}
            <div className="hidden md:block overflow-x-auto bg-white border border-gray-200 shadow-sm">
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
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usersLists.length > 0 ? (
                            usersLists.map((user) => (
                                <tr
                                    key={user.id}
                                    onClick={() => handleRowClick(user.id)}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer">
                                    {/* ID Number */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 uppercase">
                                        {user.biography?.employees?.id_number || "—"}
                                    </td>

                                    {/* Full Name */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                                        {user.biography?.personal_information?.surname}, {user.biography?.personal_information?.firstname} {user.biography?.personal_information?.middlename}
                                    </td>

                                    {/* Role */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {user.role}
                                    </td>

                                    {/* Created At */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDateTime(user.created_at)}
                                    </td>

                                    {/* Updated At */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDateTime(user.updated_at)}
                                    </td>

                                    {/* Logged In */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.password_changed ? (
                                            <span className="text-green-600 font-medium">Yes</span>
                                        ) : (
                                            <span className="text-gray-400">No</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}