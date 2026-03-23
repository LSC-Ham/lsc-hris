// src\app\hris\(protected)\(human-resource)\employees\page.tsx
import EmployeesTable from "@/components/hris/employees/EmployeesTable";
import Pagination from "@/components/ui/Pagination";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const resolvedSearchParams = await searchParams;

    const ITEMS_PER_PAGE = 10;

    const currentPage = Number(resolvedSearchParams?.page) || 1;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;

    const [employeesList, totalEmployees] = await Promise.all([
        prisma.employees.findMany({
            skip: skip,
            take: ITEMS_PER_PAGE,
            include: {
                departments: {
                    select: { department: true, }
                },
                divisions: {
                    select: { division: true }
                },
                biography: {
                    select: {
                        personal_information: {
                            select: {
                                firstname: true, middlename: true, surname: true,
                            }
                        },
                    }
                }

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight transition-colors">
                        Employees Directory
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors">
                        Manage and view all employee records.
                    </p>
                </div>

                <Link
                    href="./create"
                    className="bg-[#1a6b36] hover:bg-[#134d26] dark:bg-[#1a6b36] dark:hover:bg-[#208242] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm text-center w-full md:w-auto"
                >
                    + Add Employee
                </Link>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-300">
                <EmployeesTable employeesList={employeesList} />

                <div className="border-t border-gray-200 dark:border-zinc-800 transition-colors">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        totalItems={totalEmployees}
                        itemName="employees"
                    />
                </div>
            </div>
        </div>
    );
}