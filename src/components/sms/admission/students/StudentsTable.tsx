"use client";

import { useRouter } from "next/navigation";

export default function StudentsTable({ studentsList }: { studentsList: any[] }) {
    const router = useRouter();

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

    const handleRowClick = (idNumber: string) => {
        if (idNumber) {
            router.push(`/sms/admission/students/${idNumber}`);
        }
    };

    return (
        <>
            <div className="block md:hidden divide-y divide-gray-100">
                {studentsList.length > 0 ? (
                    studentsList.map((stu: any) => (
                        <div
                            key={stu.id}
                            onClick={() => handleRowClick(stu.id_number)} // <-- Added onClick
                            className="p-4 hover:bg-gray-50 transition-colors space-y-3 cursor-pointer">
                            {/* Card Header */}
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex flex-col gap-2.5">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight capitalize">
                                        {stu.biography?.personal_information?.surname}, {stu.biography?.personal_information?.firstname} {stu.biography?.personal_information?.middlename}
                                    </h3>

                                    {/* Badges Container */}
                                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold shadow-sm">
                                            ID: {stu.id_number}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No students found.
                    </div>
                )}
            </div>

            {/* 💻 DESKTOP VIEW: Full Original Table Layout */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID Number</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Updated At</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {studentsList.length > 0 ? (
                            studentsList.map((stu: any) => (
                                <tr
                                    key={stu.id}
                                    onClick={() => handleRowClick(stu.id_number)} // <-- Added onClick
                                    className="hover:bg-gray-50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 uppercase">{stu.id_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-medium capitalize">
                                            {stu.biography?.personal_information?.surname}, {stu.biography?.personal_information?.firstname} {stu.biography?.personal_information?.middlename}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-medium capitalize">
                                           {stu.biography?.personal_information?.mobile_no}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateTime(stu.created_at ?? null)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateTime(stu.updated_at ?? null)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm">
                                    No students found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );

}