// src\app\hris\(protected)\(user)\leave\[id_number]\page.tsx
import Link from "next/link";
import LeaveManagementPage from "./EmployeesLeavePage";
import Pagination from "@/components/ui/Pagination";
import { prisma } from "@/lib/prisma";

export default async function Page({
    searchParams, params
}: {
    searchParams: Promise<{ page?: string; query?: string }>;
    params: Promise<{ id_number: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const { id_number } = await params;

    const ITEMS_PER_PAGE = 10;
    const currentPage = Number(resolvedSearchParams?.page) || 1;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;
    const query = resolvedSearchParams?.query || "";

    const whereFilter: any = {
        employees: {
            id_number: id_number
        }
    };

    if (query) {
        whereFilter.leave_type = {
            contains: query,
            mode: "insensitive" as const,
        };
    }

    const [leavesList, totalLeaves] = await Promise.all([
        prisma.employees_leaves.findMany({
            where: whereFilter,
            skip: skip,
            take: ITEMS_PER_PAGE,
            orderBy: { created_at: "desc" },
        }),
        prisma.employees_leaves.count({
            where: whereFilter
        })
    ]);

    const totalPages = Math.ceil(totalLeaves / ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight transition-colors">
                        Leave Management
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors">
                        View balance and manage leave applications for <span className="font-bold text-gray-700 dark:text-zinc-300">{id_number}</span>.
                    </p>
                </div>

                <Link
                    href={`/hris/leave/file`}
                    className="bg-[#1a6b36] hover:bg-[#134d26] dark:bg-[#1a6b36] dark:hover:bg-[#208242] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm text-center w-full md:w-auto"
                >
                    + File Leave
                </Link>
            </div>

            <div className="rounded-xl shadow-sm transition-colors duration-300">
                <div className="border-gray-200 dark:border-zinc-800 transition-colors">

                    <LeaveManagementPage
                        leavesList={JSON.parse(JSON.stringify(leavesList))} // Serialized to prevent date errors
                        defaultQuery={query}
                    />

                    {totalPages > 0 && (
                        <div className="border-t border-gray-200 dark:border-zinc-800 transition-colors">
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                totalItems={totalLeaves}
                                itemName="leaves"
                            />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}