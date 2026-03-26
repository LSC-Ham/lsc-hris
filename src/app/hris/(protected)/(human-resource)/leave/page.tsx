// src\app\hris\(protected)\(human-resource)\leaves\page.tsx
import Pagination from "@/components/ui/Pagination";
import { prisma } from "@/lib/prisma";
import LeaveManagementPage from "./LeaveManagementPage";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HRLeavesManagementPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string; query?: string }>;
}) {
    // ============================================================================
    // 1. AUTHORIZATION GUARD
    // ============================================================================
    // TODO: Replace this with your actual authentication fetcher (NextAuth, Clerk, etc.)
    // Example: 
    // const session = await getServerSession(authOptions);
    // const currentUserRole = session?.user?.role; 

    const currentUserRole = "HR"; // <-- MOCK ROLE: Replace with actual session role

    const allowedRoles = ["HR", "Human Resource", "Vice President", "VP"];
    const isAuthorized = allowedRoles.includes(currentUserRole);

    if (!isAuthorized) {
        // Redirect unauthorized users back to a safe page (e.g., their own dashboard)
        redirect("/hris/dashboard");
    }
    // ============================================================================

    const resolvedSearchParams = await searchParams;

    const ITEMS_PER_PAGE = 10;
    const currentPage = Number(resolvedSearchParams?.page) || 1;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;
    const query = resolvedSearchParams?.query || "";

    // 2. Build a robust search filter for HR
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

    // 3. Fetch all leaves and include the employee details
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
            </div>

            <div className="rounded-xl shadow-sm transition-colors duration-300">
                <div className="border-gray-200 dark:border-zinc-800 transition-colors">

                    <LeaveManagementPage
                        leavesList={JSON.parse(JSON.stringify(leavesList))} // Serialized to prevent date errors
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