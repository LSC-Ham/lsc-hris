// src\app\hris\(protected)\(user)\leave\view\[id]\page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ViewRequestorLeavePage from "./ViewRequestorLeavePage";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ViewSpecificLeaveServerPage({ params }: PageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/hris/leave/request");
    }

    const userId = (session.user as any).id || "";

    const currentUserData = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            biography: {
                select: {
                    employees: {
                        select: {
                            department_role: true,
                            biography: {
                                select: {
                                    personal_information: {
                                        select: {
                                            firstname: true,
                                            surname: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const leaveRecord = await prisma.employees_leaves.findUnique({
        where: {
            id: id,
        },
    });

    if (!leaveRecord) {
        notFound();
    }

    const employeeData = currentUserData?.biography?.employees;
    const personalInfo = employeeData?.biography?.personal_information;

    const departmentRole = employeeData?.department_role || "";
    const headFullName = personalInfo
        ? `${personalInfo.firstname} ${personalInfo.surname}`
        : "Department Head";

    const serializedLeave = JSON.parse(JSON.stringify(leaveRecord));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>

                    <h1 className="text-2xl font-bold text-foreground tracking-tight transition-colors">
                        View Leave Application
                    </h1>
                    <p className="text-sm text-muted transition-colors">
                        Read-only details of the filed leave request.
                    </p>
                </div>
            </div>

            <div className="rounded-xl shadow-sm transition-colors duration-300">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-colors rounded-xl p-6 sm:p-8">
                    <ViewRequestorLeavePage
                        leave={serializedLeave}
                        departmentRole={departmentRole}
                        headName={headFullName}
                    />
                </div>
            </div>
        </div>
    );
}