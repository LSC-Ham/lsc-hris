//src\app\hris\(protected)\(human-resource)\leave\page.tsx
import Pagination from "@/components/ui/Pagination";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import LeaveManagementWrapper, { StatConfig } from "@/components/hris/leave/table/LeaveManagementWrapper";
import ResetLeavesButton from "./ResetLeavesButton";

export default async function HRLeavesManagementPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string; query?: string }>;
}) {

    const currentUserRole = "HR";

    const allowedRoles = ["HR", "Human Resource", "Vice President", "VP"];
    const isAuthorized = allowedRoles.includes(currentUserRole);

    if (!isAuthorized) {
        redirect("/hris/dashboard");
    }

    const resolvedSearchParams = await searchParams;

    const ITEMS_PER_PAGE = 10;
    const currentPage = Number(resolvedSearchParams?.page) || 1;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;
    const query = resolvedSearchParams?.query || "";

    const whereFilter: any = {};

    if (query) {
        whereFilter.OR = [
            { leave_type: { contains: query, mode: "insensitive" } },
            {
                employees: {
                    OR: [
                        { id_number: { contains: query, mode: "insensitive" } },
                        {
                            biography: {
                                personal_information: {
                                    OR: [
                                        { firstname: { contains: query, mode: "insensitive" } },
                                        { surname: { contains: query, mode: "insensitive" } },
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        ];
    }

    const [leavesList, totalLeaves] = await Promise.all([
        prisma.employees_leaves.findMany({
            where: whereFilter,
            skip: skip,
            take: ITEMS_PER_PAGE,
            orderBy: { created_at: "desc" },
            include: {
                employees: {
                    select: {
                        id_number: true,
                        departments: { select: { department: true } },
                        biography: {
                            select: {
                                personal_information: {
                                    select: {
                                        firstname: true,
                                        surname: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }),
        prisma.employees_leaves.count({
            where: whereFilter
        })
    ]);

    const [countPending, countApproved, countRejected] = await Promise.all([
        prisma.employees_leaves.count({
            where: {
                AND: [
                    whereFilter,
                    { OR: [{ status: null }, { status: 1 }] }
                ]
            }
        }),
        prisma.employees_leaves.count({ where: { ...whereFilter, status: 3 } }),
        prisma.employees_leaves.count({ where: { ...whereFilter, status: { in: [0, 2] } } }),
    ]);
    // 3. Define the config array for the dumb wrapper
    const statsConfig: StatConfig[] = [
        { label: "Total Leave", value: totalLeaves, iconName: "calendar", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-100 dark:border-blue-800/50" },
        { label: "Pending", value: countPending, iconName: "alert", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-100 dark:border-amber-800/50" },
        { label: "Approved", value: countApproved, iconName: "plane", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-800/50" },
        { label: "Rejected", value: countRejected, iconName: "stethoscope", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-100 dark:border-rose-800/50" }
    ];

    const totalPages = Math.ceil(totalLeaves / ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight transition-colors">
                        All Leave Applications
                    </h1>
                    <p className="text-sm text-muted transition-colors">
                        View and manage leave applications across all departments.
                    </p>
                </div>
                <ResetLeavesButton />
            </div>

            <div className="rounded-xl transition-colors duration-300">
                <div className="border-gray-200 dark:border-zinc-800 transition-colors">

                    {/* 4. Pass the config to the dumb wrapper */}
                    <LeaveManagementWrapper
                        leavesList={JSON.parse(JSON.stringify(leavesList))}
                        defaultQuery={query}
                        statsConfig={statsConfig}
                        viewRoutePrefix="/hris/leave/view"
                    />

                    <div className="border-t border-gray-200 dark:border-zinc-800 transition-colors">
                        {totalPages > 0 && (
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                totalItems={totalLeaves}
                                itemName="leaves"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}