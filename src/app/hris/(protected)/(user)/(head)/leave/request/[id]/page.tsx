// src\app\hris\(protected)\(user)\leave\view\[id]\page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ViewRequestorLeavePage from "./ViewRequestorLeavePage";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ViewSpecificLeaveServerPage({ params }: PageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/hris/login");
    }

    const userId = (session.user as any).id || "";

    const currentUserData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            biography: {
                select: {
                    employees: {
                        select: {
                            department_role: true,
                            biography: {
                                select: {
                                    personal_information: {
                                        select: { firstname: true, surname: true }
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
        where: { id: id },
    });

    if (!leaveRecord) {
        notFound();
    }

    // Fetch the VP for Administration to display their name
    const vpAdmin = await prisma.employees.findFirst({
        where: {
            ranks: {
                rank: {
                    contains: "vice president",
                    mode: "insensitive"
                }
            }
        },
        select: {
            biography: {
                select: {
                    personal_information: {
                        select: { firstname: true, surname: true }
                    }
                }
            }
        }
    });

    const vpPersonalInfo = vpAdmin?.biography?.personal_information;
    const vpFullName = vpPersonalInfo
        ? `${vpPersonalInfo.firstname} ${vpPersonalInfo.surname}`
        : "Vice President for Administration";

    const employeeData = currentUserData?.biography?.employees;
    const personalInfo = employeeData?.biography?.personal_information;
    const departmentRole = employeeData?.department_role || "";

    const headFullName = personalInfo
        ? `${personalInfo.firstname} ${personalInfo.surname}`
        : "Department Head";

    const serializedLeave = JSON.parse(JSON.stringify(leaveRecord));

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
                    View Leave Application
                </h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                    Review details and manage your department's approval status.
                </p>
            </header>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-sm">
                <ViewRequestorLeavePage
                    leave={serializedLeave}
                    departmentRole={departmentRole}
                    headName={headFullName}
                    vpName={vpFullName}
                />
            </div>
        </div>
    );
}