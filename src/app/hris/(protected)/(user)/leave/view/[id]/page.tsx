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

    // 1. Fetch the leave record AND the department ID of the employee who filed it
    const leaveRecord = await prisma.employees_leaves.findUnique({
        where: {
            id: id,
        },
        include: {
            employees: {
                select: {
                    departments_id: true, // We need this to find their specific Dept Head
                }
            }
        }
    });

    if (!leaveRecord) {
        notFound();
    }

    const departmentId = leaveRecord.employees?.departments_id;
    let headFullName = "Department Head"; 
    
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
                    />
                </div>
            </div>
        </div>
    );
}