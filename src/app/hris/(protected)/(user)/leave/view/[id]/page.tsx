// src/app/hris/(protected)/(human-resource)/leaves/requests/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RequestorFiledLeavePage from "@/components/hris/leave/RequestorFiledLeavePage";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getLeaveWarning(employeeId: string, leaveType: string) {
    const limits: Record<string, number> = {
        "Vacation Leave": 5,
        "Sick Leave": 5,
        "Emergency Leave": 3,
    };

    const limit = limits[leaveType];

    if (!limit) return null;

    const latestReset = await prisma.leave_reset_logs.findFirst({
        orderBy: { created_at: 'desc' },
        select: { created_at: true }
    });
    const resetDate = latestReset?.created_at || new Date(0);

    const usedLeaves = await prisma.employees_leaves.count({
        where: {
            employees_id: employeeId,
            leave_type: leaveType,
            created_at: { gte: resetDate },
            status: { notIn: [0, 2] }
        }
    });

    if (usedLeaves >= limit) {
        return `This employee has exhausted their ${leaveType} limit (Used/Pending: ${usedLeaves} / Limit: ${limit}).`;
    }

    return null;
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
                            id: true,
                            department_role: true,
                            departments_id: true,
                            ranks: { select: { rank: true } },
                            departments: { select: { department: true } },
                        }
                    }
                }
            }
        }
    });

    const leaveRecord = await prisma.employees_leaves.findUnique({
        where: { id: id },
        include: {
            employees: {
                select: {
                    department_role: true,
                    departments_id: true,
                    departments: true,
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
    });

    if (!leaveRecord) {
        notFound();
    }

    // 3. Call the helper function to get the warning message
    const warningMessage = await getLeaveWarning(leaveRecord.employees_id, leaveRecord.leave_type);

    const employeeData = currentUserData?.biography?.employees;

    const isVP = employeeData?.ranks?.rank?.toLowerCase().includes("vice president");
    const isHR = employeeData?.departments?.department?.toLowerCase() === "human resource";
    const isOwner = leaveRecord.employees_id === employeeData?.id;

    const isDeptHead =
        employeeData?.departments_id === leaveRecord.employees?.departments_id &&
        ["head", "assistant head"].includes(employeeData?.department_role?.toLowerCase() || "");

    if (!employeeData || (!isVP && !isHR && !isOwner && !isDeptHead)) {
        redirect("/hris/dashboard");
    }

    const requestorInfo = leaveRecord.employees?.biography?.personal_information;
    const requestorName = requestorInfo
        ? `${requestorInfo.firstname} ${requestorInfo.surname}`
        : "Unknown Employee";

    const requestorDepartment = (leaveRecord.employees?.departments as any)?.department
        || (leaveRecord.employees?.departments as any)?.name
        || "Unknown Department";

    const requestorRole = leaveRecord.employees?.department_role?.toLowerCase() || "";
    const isRequestorHead = ["head", "assistant head"].includes(requestorRole);

    const applicantDepartmentId = leaveRecord.employees?.departments_id;
    const departmentHead = await prisma.employees.findFirst({
        where: {
            departments_id: applicantDepartmentId,
            department_role: {
                in: ["Head", "head", "Assistant Head", "assistant head"]
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

    const hasDepartmentHead = !!departmentHead;

    const vicePresident = await prisma.employees.findFirst({
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

    const headInfo = departmentHead?.biography?.personal_information;
    const actualHeadName = headInfo
        ? `${headInfo.firstname} ${headInfo.surname}`
        : "Department Head";

    const vpInfo = vicePresident?.biography?.personal_information;
    const actualVPName = vpInfo
        ? `${vpInfo.firstname} ${vpInfo.surname}`
        : "Vice President";

    const departmentRole = employeeData?.department_role || "";
    const serializedLeave = JSON.parse(JSON.stringify(leaveRecord));

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-foreground tracking-tight transition-colors">
                    View Leave Application
                </h1>
                <p className="text-sm text-muted transition-colors">
                    Review details and manage approval status for this request.
                </p>
            </header>

            <div className="bg-white dark:bg-zinc-900 border border-divider rounded-xl p-6 sm:p-8 shadow-sm">
                <RequestorFiledLeavePage
                    leave={serializedLeave}
                    departmentRole={departmentRole}
                    headName={actualHeadName}
                    vpName={actualVPName}
                    rank={employeeData.ranks?.rank}
                    department={employeeData.departments?.department}
                    employeeName={requestorName}
                    departmentName={requestorDepartment}
                    isRequestorHead={isRequestorHead}
                    hasDepartmentHead={hasDepartmentHead}
                    isOwner={isOwner}
                    limitWarning={warningMessage} // 4. Pass it down to the client component
                />
            </div>
        </div>
    );
}