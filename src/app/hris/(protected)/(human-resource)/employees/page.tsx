// src/app/(protected)/(admin)/employees/page.tsx
import Pagination from "@/components/ui/Pagination";
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

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    // 1. Await the searchParams Promise
    const resolvedSearchParams = await searchParams;

    // 2. Pagination Setup
    const ITEMS_PER_PAGE = 10;

    // 3. Use the awaited object
    const currentPage = Number(resolvedSearchParams?.page) || 1;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;

    // 2. Fetch Data and Total Count simultaneously
    const [employeesList, totalEmployees] = await Promise.all([
        prisma.employees.findMany({
            skip: skip,
            take: ITEMS_PER_PAGE,
            include: {
                personal_information: {
                    select: {
                        firstname: true,
                        middlename: true,
                        surname: true,
                    }
                },
                divisions: { select: { division: true } },
                departments: { select: { department: true } }
            },
            orderBy: {
                created_at: "desc",
            },
        }),
        prisma.employees.count()
    ]);

    const totalPages = Math.ceil(totalEmployees / ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Employees Directory</h1>
                    <p className="text-sm text-gray-500">Manage and view all employee records.</p>
                </div>
                <Link
                    href="./create"
                    className="bg-[#1a6b36] hover:bg-[#155a2b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm text-center w-full md:w-auto"
                >
                    + Add Employee
                </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

                {/* 📱 MOBILE VIEW: Detailed Card Layout */}
                <div className="block md:hidden divide-y divide-gray-100">
                    {employeesList.length > 0 ? (
                        employeesList.map((emp) => (
                            <div key={emp.id} className="p-4 hover:bg-gray-50 transition-colors space-y-3">
                                {/* Card Header */}
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex flex-col gap-2.5">
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight capitalize">
                                            {emp.personal_information?.surname}, {emp.personal_information?.firstname} {emp.personal_information?.middlename}
                                        </h3>

                                        {/* Badges Container */}
                                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold shadow-sm">
                                                ID: {emp.id_number}
                                            </span>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold shadow-sm border
                                                ${emp.remarks?.toLowerCase() === 'regular' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    emp.remarks?.toLowerCase() === 'contractual' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        emp.remarks?.toLowerCase() === 'resigned' ? 'bg-red-50 text-red-700 border-red-200' :
                                                            'bg-gray-100 text-gray-600 border-gray-200'}`}
                                            >
                                                {emp.remarks || "No Status"}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`./employees/${emp.id_number}`}
                                        className="shrink-0 flex items-center gap-1.5 text-[#1a6b36] bg-green-50/50 hover:bg-[#1a6b36] hover:text-white border border-green-100 hover:border-[#1a6b36] px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm group"
                                    >
                                        <span>View</span>
                                    </Link>
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
                                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {employeesList.length > 0 ? (
                                employeesList.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 uppercase">{emp.id_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium capitalize">
                                                {emp.personal_information?.surname}, {emp.personal_information?.firstname} {emp.personal_information?.middlename}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">{emp.divisions?.division}</div>
                                            <div className="text-xs text-gray-500">{emp.departments?.department}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateTime(emp.hired_at)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateTime(emp.created_at)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateTime(emp.updated_at)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                                            {emp.remarks || <span className="text-gray-400 italic">None</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`./employees/${emp.id_number}`} className="text-[#1a6b36] hover:text-[#155a2b] hover:underline">
                                                View / Edit
                                            </Link>
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

                {/* Pagination rendered at the bottom of the table container */}
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    totalItems={totalEmployees}
                    itemName="users"
                />
            </div>
        </div>
    );
}