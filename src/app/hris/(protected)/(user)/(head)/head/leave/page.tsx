import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LeaveRequestsTable from "./LeaveRequestsTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Page() {

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/hris/login");
    }

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

    const headEmployee = await prisma.employees.findUnique({
        where: { id: currentUserId?.biography?.employees?.id },
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

    const departmentLeaves = await prisma.employees_leaves.findMany({
        where: {
            employees: {
                departments_id: headEmployee.departments?.id,
                id: { not: currentUserId?.biography?.employees?.id }
            }
        },
        include: {
            employees: {
                select: {
                    biography: {
                        select: {
                            personal_information: { select: { firstname: true, surname: true } }
                        }
                    }
                }
            }
        },
        orderBy: {
            created_at: 'desc',
        }
    });

    const serializedLeaves = JSON.parse(JSON.stringify(departmentLeaves));

    return (
        <div className="space-y-6 w-full max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight transition-colors">
                        Department Leave Requests
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors">
                        Review and manage leave applications from your team.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-300">
                <LeaveRequestsTable requests={serializedLeaves} />
            </div>
        </div>
    );
}