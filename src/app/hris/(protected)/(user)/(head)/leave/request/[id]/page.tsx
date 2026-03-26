// src/app/hris/(protected)/(user)/leave/view/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RequestorFiledLeavePage from "@/components/hris/leave/RequestorFiledLeavePage";

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

    // Fetch the leave record AND include the applicant's department info, role, and ID
    const leaveRecord = await prisma.employees_leaves.findUnique({
        where: { id: id },
        include: {
            employees: {
                select: {
                    department_role: true, // <-- NEW: Fetching the requestor's role
                    departments_id: true,  // <-- NEW: Fetching the department ID to find the head
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

    // --- Extract Requestor Information ---
    const requestorInfo = leaveRecord.employees?.biography?.personal_information;
    const requestorName = requestorInfo
        ? `${requestorInfo.firstname} ${requestorInfo.surname}`
        : "Unknown Employee";

    const requestorDepartment = (leaveRecord.employees?.departments as any)?.department
        || (leaveRecord.employees?.departments as any)?.name
        || "Unknown Department";

    // --- Check if the Requestor is a Head ---
    const requestorRole = leaveRecord.employees?.department_role?.toLowerCase() || "";
    const isRequestorHead = ["head", "assistant head"].includes(requestorRole);

    // --- Fetch the Actual Department Head ---
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
    const headInfo = departmentHead?.biography?.personal_information;
    const actualHeadName = headInfo
        ? `${headInfo.firstname} ${headInfo.surname}`
        : "Department Head";

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
    const departmentRole = employeeData?.department_role || "";

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
                <RequestorFiledLeavePage
                    leave={serializedLeave}
                    departmentRole={departmentRole}
                    headName={actualHeadName} // Now showing the ACTUAL head's name instead of the logged-in user's name
                    vpName={vpFullName}
                    employeeName={requestorName}
                    departmentName={requestorDepartment}
                    isRequestorHead={isRequestorHead}     // <-- NEW: Pass down the prop
                    hasDepartmentHead={hasDepartmentHead} // <-- NEW: Pass down the prop
                />
            </div>
        </div>
    );
}