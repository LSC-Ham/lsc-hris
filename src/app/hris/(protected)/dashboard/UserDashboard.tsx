import { prisma } from "@/lib/prisma";

export default async function UserDashboard({ userId }: { userId: string }) {
    // 1. Fetch data specific ONLY to the logged-in user
    const [userProfile, myRecentLeaves] = await Promise.all([
        prisma.employees.findUnique({
            where: { id: userId },
            include: {
                departments: { select: { department: true } },
                ranks: { select: { rank: true } },
                biography: {
                    select: {
                        personal_information: {
                            select: { firstname: true, surname: true }
                        }
                    }
                }
            }
        }),
        prisma.employees_leaves.findMany({
            where: { employees_id: userId },
            take: 5,
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                leave_type: true,
                date: true,
                status: true,
            }
        })
    ]);

    const firstName = userProfile?.biography?.personal_information?.firstname || "Employee";
    const lastName = userProfile?.biography?.personal_information?.surname || "";
    const departmentName = userProfile?.departments?.department || "No Department";
    const rankName = userProfile?.ranks?.rank || "No Rank";

    const getStatusDetails = (status: number | null) => {
        switch (status) {
            case null:
                return { label: "Pending Head", style: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700" };
            case 0:
                return { label: "Declined by Head", style: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" };
            case 1:
                return { label: "Pending VP", style: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" };
            case 2:
                return { label: "Declined by VP", style: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" };
            case 3:
                return { label: "Fully Approved", style: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" };
            default:
                return { label: "Pending", style: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" };
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight transition-colors capitalize">
                        Welcome back, {firstName} {lastName}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors capitalize">
                        {rankName} • {departmentName}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 transition-all hover:shadow-md flex flex-col">
                <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    My Recent Leave Requests
                </p>

                <div className="space-y-4 flex-1 overflow-y-auto">
                    {myRecentLeaves.length === 0 ? (
                        <div className="py-6 text-center text-sm text-gray-500 dark:text-zinc-400 transition-colors">
                            No recent leave requests
                        </div>
                    ) : (
                        myRecentLeaves.map((leave) => {
                            const { label: statusLabel, style: statusStyle } = getStatusDetails(leave.status);

                            return (
                                <div key={leave.id} className="flex flex-col border-b border-gray-100 dark:border-zinc-800/80 pb-3 last:border-0 last:pb-0 capitalize transition-colors">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate pr-2">
                                            {leave.leave_type.replace(/_/g, ' ')}
                                        </p>
                                        {/* 3. APPLY THE NEW STYLE PROPERTY HERE */}
                                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-md uppercase tracking-wider transition-colors ${statusStyle}`}>
                                            {statusLabel}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[11px] text-gray-500 dark:text-zinc-400 whitespace-nowrap flex items-center gap-1">
                                            {leave.date ? new Date(leave.date).toLocaleDateString() : 'No date'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}