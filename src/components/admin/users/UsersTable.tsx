import Link from "next/link";


export default function UsersTable({ usersLists }: { usersLists: any[] }) {

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
    return (
        <>

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
                                {/* Hidden on Mobile */}
                                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Updated At
                                </th>
                                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 uppercase">
                                            {user.biography?.employees?.id_number}
                                        </td>

                                        {/* Full Name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                                            {user.biography?.personal_information?.surname}, {user.biography?.personal_information?.firstname} {user.biography?.personal_information?.middlename}
                                        </td>

                                        {/* Role - Hidden on Mobile */}
                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.role}
                                        </td>

                                        {/* Created At - Hidden on Mobile */}
                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDateTime(user.created_at)}
                                        </td>

                                        {/* Updated At - Hidden on Mobile */}
                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDateTime(user.updated_at)}
                                        </td>

                                        {/* Logged In - Hidden on Mobile */}
                                        <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600">
                                            {user.password_changed ?
                                                <span className="text-green-600 font-medium">Yes</span> :
                                                <span className="text-gray-400">No</span>
                                            }
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/admin/users/${user.id}`}
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
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}