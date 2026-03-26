// src\app\hris\(protected)\(user)\leave\view\[id]\page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ViewLeavePage from "./ViewLeavePage";

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

    // Note: Change '.name' to whatever your department string field is called (e.g., '.department_name')
    const departmentName = leaveRecord.employees?.departments?.department || "";

    const departmentId = leaveRecord.employees?.departments?.id;
    let headFullName = "Department Head";
    let vpFullName = "Vice President"; // Default fallback

    // 1. Fetch Department Head
    if (departmentId) {
        const departmentHead = await prisma.employees.findFirst({
            where: {
                departments_id: departmentId,
                department_role: {
                    equals: "head",
                    mode: "insensitive"
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
        const personalInfo = departmentHead?.biography?.personal_information;
        if (personalInfo) {
            headFullName = `${personalInfo.firstname} ${personalInfo.surname}`;
        }
    }

    // 2. Fetch Vice President
    const vicePresident = await prisma.employees.findFirst({
        where: {
            department_role: {
                equals: "vice president",
                mode: "insensitive"
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
                    <ViewLeavePage
                        leave={serializedLeave}
                        headName={headFullName}
                        vpName={vpFullName}
                        employeeName={requestorName} // Pass down the requestor name
                        departmentName={departmentName} // Pass down the department
                    />
                </div>
            </div>
        </div>
    );
}