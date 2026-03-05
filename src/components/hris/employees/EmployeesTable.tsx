"use client";

import { useRouter } from "next/navigation";

export default function EmployeesTable({ employeesList }: { employeesList: any[] }) {
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
            router.push(`/hris/employees/${idNumber}`);
        }
    };

    return (
        <>
            <div className="block md:hidden divide-y divide-gray-100">
                {employeesList.length > 0 ? (
                    employeesList.map((emp: any) => (
                        <div
                            key={emp.id}
                            onClick={() => handleRowClick(emp.id_number)} // <-- Added onClick
                            className="p-4 hover:bg-gray-50 transition-colors space-y-3 cursor-pointer">
                            {/* Card Header */}
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex flex-col gap-2.5">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight capitalize">
                                        {emp.biography?.personal_information?.surname}, {emp.biography?.personal_information?.firstname} {emp.biography?.personal_information?.middlename}
                                    </h3>

                                    {/* Badges Container */}
                                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold shadow-sm">
                                            ID: {emp.id_number}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold shadow-sm border
                                                ${emp.employees?.remarks?.toLowerCase() === 'regular' ? 'bg-green-50 text-green-700 border-green-200' :
                                                emp.employees?.remarks?.toLowerCase() === 'contractual' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    emp.employees?.remarks?.toLowerCase() === 'resigned' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-gray-100 text-gray-600 border-gray-200'}`}
                                        >
                                            {emp.remarks || "No Status"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-600 pt-2 border-t border-gray-50">
                                <div className="col-span-2">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">Division / Dept</span>
                                    <span className="font-medium text-gray-800">{emp.divisions?.division}</span>
                                    <span className="text-gray-500 block text-xs">{emp.departments?.department}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No employees found.
                    </div>
                )}
            </div>

            {/* 💻 DESKTOP VIEW: Full Original Table Layout */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID Number</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Division / Dept</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hired At</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created At</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Updated At</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employeesList.length > 0 ? (
                            employeesList.map((emp: any) => (
                                <tr
                                    key={emp.id}
                                    onClick={() => handleRowClick(emp.id_number)} // <-- Added onClick
                                    className="hover:bg-gray-50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 uppercase">{emp.id_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-medium capitalize">
                                            {emp.biography?.personal_information?.surname}, {emp.biography?.personal_information?.firstname} {emp.biography?.personal_information?.middlename}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-medium">{emp.divisions?.division}</div>
                                        <div className="text-xs text-gray-500">{emp.departments?.department}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateTime(emp.hired_at ?? null)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateTime(emp.created_at ?? null)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateTime(emp.updated_at ?? null)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                                        {emp.remarks || <span className="text-gray-400 italic">None</span>}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm">
                                    No employees found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );

}