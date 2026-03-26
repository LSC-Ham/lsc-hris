// src\app\hris\(protected)\(user)\leave\view\[id]\page.tsx
import RequestorFiledLeavePage from "@/components/hris/leave/RequestorFiledLeavePage";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ViewSpecificLeaveServerPage({ params }: PageProps) {
    const { id } = await params;

    const leaveRecord = await prisma.employees_leaves.findUnique({
        where: {
            id: id,
        },
        include: {
            employees: {
                select: {
                    department_role: true, // <-- NEW: Fetching the requestor's role
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

    // --- Extract Requestor Information ---
    const requestorInfo = leaveRecord.employees?.biography?.personal_information;
    const requestorName = requestorInfo
        ? `${requestorInfo.firstname} ${requestorInfo.surname}`
        : "Unknown Employee";

    const departmentName = (leaveRecord.employees?.departments as any)?.department
        || (leaveRecord.employees?.departments as any)?.name
        || "";

    // --- Check if the Requestor is a Head ---
    const requestorRole = leaveRecord.employees?.department_role?.toLowerCase() || "";
    const isRequestorHead = ["head", "assistant head"].includes(requestorRole);

    const departmentId = leaveRecord.employees?.departments?.id;
    let headFullName = "Department Head";
    let vpFullName = "Vice President"; // Default fallback
    let hasDepartmentHead = false; // <-- NEW: Flag for missing heads

    // 1. Fetch Department Head
    if (departmentId) {
        const departmentHead = await prisma.employees.findFirst({
            where: {
                departments_id: departmentId,
                department_role: {
                    in: ["Head", "head", "Assistant Head", "assistant head"]
                }
            },
            select: {
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
        });

        hasDepartmentHead = !!departmentHead; // <-- Set to true if a head was found
        const personalInfo = departmentHead?.biography?.personal_information;
        if (personalInfo) {
            headFullName = `${personalInfo.firstname} ${personalInfo.surname}`;
        }
    }

    // 2. Fetch Vice President (Aligned with previous files)
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
                        select: {
                            firstname: true,
                            surname: true,
                        }
                    }
                }
            }
        }
    });

    const vpPersonalInfo = vicePresident?.biography?.personal_information;
    if (vpPersonalInfo) {
        vpFullName = `${vpPersonalInfo.firstname} ${vpPersonalInfo.surname}`;
    }

    const serializedLeave = JSON.parse(JSON.stringify(leaveRecord));

    return (
        <div className="space-y-6 w-full">
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
                    <RequestorFiledLeavePage
                        leave={serializedLeave}
                        headName={headFullName}
                        vpName={vpFullName}
                        employeeName={requestorName}
                        departmentName={departmentName}
                        isRequestorHead={isRequestorHead}     // <-- NEW: Pass down the prop
                        hasDepartmentHead={hasDepartmentHead} // <-- NEW: Pass down the prop
                    />
                </div>
            </div>
        </div>
    );
}