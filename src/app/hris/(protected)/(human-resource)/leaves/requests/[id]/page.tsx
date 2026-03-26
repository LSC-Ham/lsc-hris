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

export default async function ViewSpecificLeaveServerPage({ params }: PageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/hris/leave/request");
    }

    const userId = (session.user as any).id || "";

    // 1. Fetch current logged-in user data for gatekeeping
    const currentUserData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            biography: {
                select: {
                    employees: {
                        select: {
                            id: true,
                            department_role: true,
                            ranks: { select: { rank: true } },
                            departments: { select: { department: true } },
                        }
                    }
                }
            }
        }
    });

    // 2. Fetch the leave record AND include the applicant's department ID, role, department info, and biography
    const leaveRecord = await prisma.employees_leaves.findUnique({
        where: { id: id },
        include: {
            employees: {
                select: {
                    department_role: true, // <-- NEW: Fetch the requestor's role
                    departments_id: true,
                    departments: true,
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
    });

    if (!leaveRecord) {
        notFound();
    }

    const employeeData = currentUserData?.biography?.employees;
    const isVP = employeeData?.ranks?.rank?.toLowerCase() === "vice president";
    const isHR = employeeData?.departments?.department?.toLowerCase() === "human resource";
    const isOwner = leaveRecord.employees_id === employeeData?.id;

    // GATEKEEPER
    if (!employeeData || (!isVP && !isHR && !isOwner)) {
        redirect("/hris/dashboard");
    }

    // --- Extract Requestor Information ---
    const requestorInfo = leaveRecord.employees?.biography?.personal_information;
    const requestorName = requestorInfo
        ? `${requestorInfo.firstname} ${requestorInfo.surname}`
        : "Unknown Employee";

    const requestorDepartment = (leaveRecord.employees?.departments as any)?.department
        || (leaveRecord.employees?.departments as any)?.name
        || "Unknown Department";

    // --- Check if Requestor is a Head ---
    const requestorRole = leaveRecord.employees?.department_role?.toLowerCase() || "";
    const isRequestorHead = ["head", "assistant head"].includes(requestorRole);

    // 3. Fetch the Department Head for the specific applicant's department
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

    // --- Check if the department has a head ---
    const hasDepartmentHead = !!departmentHead; // Evaluates to true if a head exists, false if null

    // 4. Fetch the Vice President from the database
    const vicePresident = await prisma.employees.findFirst({
        where: {
            ranks: {
                rank: {
                    equals: "Vice President",
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

    // Format the fetched names
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight transition-colors">
                        View Leave Application
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors">
                        Read-only details of the filed leave request and approval management.
                    </p>
                </div>
            </div>

            <div className="rounded-xl shadow-sm transition-colors duration-300">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-colors rounded-xl p-6 sm:p-8">
                    <RequestorFiledLeavePage
                        leave={serializedLeave}
                        departmentRole={departmentRole}
                        headName={actualHeadName}
                        vpName={actualVPName}
                        rank={employeeData.ranks?.rank}
                        department={employeeData.departments?.department}
                        employeeName={requestorName}
                        departmentName={requestorDepartment}
                        isRequestorHead={isRequestorHead}       // <-- NEW: Passed down to Smart Component
                        hasDepartmentHead={hasDepartmentHead}   // <-- NEW: Passed down to Smart Component
                    />
                </div>
            </div>
        </div>
    );
}