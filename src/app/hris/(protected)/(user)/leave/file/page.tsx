// src\app\hris\(protected)\(user)\leave\file\page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FormLeavePage from "./FormLeavePage";

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/hris/login");
    }

    const userId = (session.user as any).id || "";

    const employee = await prisma.employees.findFirst({
        where: {
            biography: {
                users_id: userId
            }
        }
    });

    if (!employee) {
        return (
            <div className="p-6 text-center text-red-600 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl m-6 transition-colors">
                Error: No associated employee record found for this account.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight transition-colors">
                        File a Leave
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors">
                        Submit your request for time off. It will be sent to HR for approval.
                    </p>
                </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20 transition-colors duration-300">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5"
                >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" x2="12" y1="9" y2="13" />
                    <line x1="12" x2="12.01" y1="17" y2="17" />
                </svg>
                <p className="text-sm font-medium text-red-800 dark:text-white">
                    Falsification of this form or failing to adhere to Timekeeping Policy is grounds for disciplinary action, up to including dismissal.
                </p>
            </div>
            <div className="rounded-xl shadow-sm transition-colors duration-300">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-colors rounded-xl p-6 sm:p-8">
                    <FormLeavePage employeeId={employee.id} />
                </div>
            </div>
        </div>
    );
}