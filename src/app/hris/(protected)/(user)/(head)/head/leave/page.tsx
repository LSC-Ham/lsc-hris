// src\app\hris\(protected)\(user)\leave\administration\page.tsx (or your path for the Head view)
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Pagination from "@/components/ui/Pagination";
import LeaveManagementWrapper from "@/components/hris/leave/table/LeaveManagementWrapper";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ page?: string; query?: string }>;
}) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/hris/login");
    }

    const resolvedSearchParams = await searchParams;
    const userId = (session.user as any).id || "";

    const currentUserId = await prisma.user.findUnique({
        where: {
            id: userId
        }, select: {
            biography: {
                select: {
                    employees: {
                        select: { id: true }
                    }
                }
            }
        }
    });

    const headId = currentUserId?.biography?.employees?.id;

    const headEmployee = await prisma.employees.findUnique({
        where: { id: headId },
        select: {
            departments: {
                select: {
                    id: true,
                }
            },
            department_role: true
        }
    });

    if (!headEmployee || headEmployee.department_role?.toLowerCase() !== "head") {
        redirect("/hris/dashboard");
    }

    const ITEMS_PER_PAGE = 10;
    const currentPage = Number(resolvedSearchParams?.page) || 1;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;
    const query = resolvedSearchParams?.query || "";

    const whereFilter: any = {
        employees: {
            departments_id: headEmployee.departments?.id,
            id: { not: headId }
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
            include: {
                employees: {
                    select: {
                        biography: {
                            select: {
                                personal_information: { select: { firstname: true, surname: true } }
                            }
                        },
                        departments: {
                            select: { department: true }
                        }
                    }
                }
            },
            skip: skip,
            take: ITEMS_PER_PAGE,
            orderBy: { created_at: "desc" },
        }),
        prisma.employees_leaves.count({
            where: whereFilter
        })
    ]);

    const allApprovedLeaves = await prisma.employees_leaves.findMany({
        where: {
            employees: {
                departments_id: headEmployee.departments?.id,
                id: { not: headId }
            },
            status: { in: [3, 4] }
        },
        select: { leave_type: true }
    });

    let totalVL = 0; let totalSL = 0; let totalEL = 0;

    allApprovedLeaves.forEach((leave) => {
        const type = (leave.leave_type || "").toLowerCase();
        if (type.includes("vacation")) totalVL += 1;
        else if (type.includes("sick")) totalSL += 1;
        else if (type.includes("emergency")) totalEL += 1;
    });

    // Balances here reflect total approved leaves taken by underlings, rather than an initial pool
    const balances = {
        vl: totalVL,
        sl: totalSL,
        el: totalEL,
        get total() { return this.vl + this.sl + this.el; }
    };

    const totalPages = Math.ceil(totalLeaves / ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight transition-colors">
                        Department Leave Requests
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors">
                        Review and manage leave applications from your team. Stats reflect total approved leaves.
                    </p>
                </div>
            </div>

            <div className="rounded-xl shadow-sm transition-colors duration-300">
                <div className="border-gray-200 dark:border-zinc-800 transition-colors">

                    <LeaveManagementWrapper
                        leavesList={JSON.parse(JSON.stringify(leavesList))}
                        defaultQuery={query}
                    />

                    {totalPages > 0 && (
                        <div className="border-t border-gray-200 dark:border-zinc-800 transition-colors">
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                totalItems={totalLeaves}
                                itemName="requests"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}