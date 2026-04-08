// src/app/hris/(protected)/(user)/leave/[id_number]/page.tsx
import Link from "next/link";
import Pagination from "@/components/ui/Pagination";
import { prisma } from "@/lib/prisma";
import LeaveManagementWrapper from "@/components/hris/leave/table/LeaveManagementWrapper";

export default async function Page({
    searchParams, params
}: {
    searchParams: Promise<{ page?: string; query?: string }>;
    params: Promise<{ id_number: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const { id_number } = await params;

    const lastReset = await prisma.leave_reset_logs.findFirst({
        orderBy: { date: 'desc' },
        select: { date: true }
    });

    const resetCutoff = lastReset?.date || new Date(0);

    const ITEMS_PER_PAGE = 10;
    const currentPage = Number(resolvedSearchParams?.page) || 1;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;
    const query = resolvedSearchParams?.query || "";

    const whereFilter: any = {
        employees: { id_number: id_number }
    };

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

    const employeeData = await prisma.employees.findUnique({
        where: { id_number: id_number },
        select: {
            remarks: true,
            hired_at: true,
            divisions: {
                select: { division: true }
            }
        }
    });

    const [leavesList, totalLeaves] = await Promise.all([
        prisma.employees_leaves.findMany({
            where: whereFilter,
            skip: skip,
            take: ITEMS_PER_PAGE,
            orderBy: { updated_at: "desc" },
            include: {
                employees: {
                    select: {
                        id_number: true,
                        divisions: { select: { division: true } },
                        departments: { select: { department: true } },
                        remarks: true,
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

    const allApprovedLeavesSinceReset = await prisma.employees_leaves.findMany({
        where: {
            employees: { id_number: id_number },
            status: 3,
            created_at: { gt: resetCutoff }
        },
        select: { leave_type: true }
    });

    let INITIAL_VL = 0;
    let INITIAL_SL = 0;
    let INITIAL_SIL = 0;
    let INITIAL_EL = 0;

    const remarks = employeeData?.remarks?.toLowerCase() || "";
    const divisionName = employeeData?.divisions?.division?.toLowerCase() || "";

    let yearsEmployed = 0;
    if (employeeData?.hired_at) {
        const hireDate = new Date(employeeData.hired_at);
        const today = new Date();

        const diffInMs = today.getTime() - hireDate.getTime();
        yearsEmployed = diffInMs / (1000 * 60 * 60 * 24 * 365.25);
    }
    console.log({ yearsEmployed });
    if (divisionName === 'academics') {
        if (remarks === 'regular') {
            INITIAL_VL = 5;
            INITIAL_SL = 5;
            INITIAL_EL = 3;
            INITIAL_SIL = 0;
        }
        else if (remarks === 'probationary') {
            if (yearsEmployed < 1) {
                INITIAL_SIL = 5;
            } else {
                INITIAL_SIL = 0;
            }
            INITIAL_VL = 0;
            INITIAL_SL = 0;
            INITIAL_EL = 0;
        }
    }
    else if (divisionName === 'administration') {
        INITIAL_VL = 5;
        INITIAL_SL = 5;
        INITIAL_EL = 3;
        INITIAL_SIL = 0;
    }
    else {
        INITIAL_VL = 5;
        INITIAL_SL = 5;
        INITIAL_SIL = 0;
        INITIAL_EL = 3;
    }

    let usedVL = 0; let usedSL = 0; let usedSIL = 0; let usedEL = 0;

    allApprovedLeavesSinceReset.forEach((leave) => {
        const type = (leave.leave_type || "").toLowerCase();
        if (type.includes("vacation")) usedVL += 1;
        else if (type.includes("sick")) usedSL += 1;
        else if (type.includes("incentive")) usedSIL += 1;
        else if (type.includes("emergency")) usedEL += 1;
    });

    const balances = {
        vl: Math.max(0, INITIAL_VL - usedVL),
        sl: Math.max(0, INITIAL_SL - usedSL),
        sil: Math.max(0, INITIAL_SIL - usedSIL),
        el: Math.max(0, INITIAL_EL - usedEL),
        get total() { return this.vl + this.sl + this.sil + this.el; }
    };

    const totalPages = Math.ceil(totalLeaves / ITEMS_PER_PAGE);

    const stats = [
        { label: "Total Leave", value: balances.total, iconName: "calendar" as const, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-100 dark:border-blue-800/50" },
        ...(INITIAL_VL > 0 ? [{ label: "Vacation Leave Remaining", value: balances.vl, iconName: "plane" as const, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-800/50" }] : []),
        ...(INITIAL_SIL > 0 ? [{ label: "Service Incentive Leave Remaining", value: balances.sil, iconName: "plane" as const, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-800/50" }] : []),
        ...(INITIAL_SL > 0 ? [{ label: "Sick Leave Remaining", value: balances.sl, iconName: "stethoscope" as const, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-100 dark:border-amber-800/50" }] : []),
        ...(INITIAL_EL > 0 ? [{ label: "Emergency Leave Remaining", value: balances.el, iconName: "alert" as const, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-100 dark:border-rose-800/50" }] : [])
    ];

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

            <div className="rounded-xl transition-colors duration-300">
                <div className="border-gray-200 dark:border-zinc-800 transition-colors">

                    <LeaveManagementWrapper
                        leavesList={JSON.parse(JSON.stringify(leavesList))}
                        statsConfig={stats}
                        defaultQuery={query}
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