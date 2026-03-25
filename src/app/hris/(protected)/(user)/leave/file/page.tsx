// src\app\hris\(protected)\(user)\leave\file\page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust this import to your actual auth options path
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FormLeavePage from "./FormLeavePage";
import Link from "next/link"; // Added for the Back button

export default async function FileLeaveServerPage() {
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

            <div className="rounded-xl shadow-sm transition-colors duration-300">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-colors rounded-xl p-6 sm:p-8">
                    <FormLeavePage employeeId={employee.id} />
                </div>
            </div>
        </div>
    );
}