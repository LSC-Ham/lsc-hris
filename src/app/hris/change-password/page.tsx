// src\app\hris\change-password\page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ChangePasswordForm from "@/app/hris/change-password/ChangePasswordForm";

export default async function ChangePasswordPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/hris/login");
    }

    const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password_changed: true }
    });

    if (user?.password_changed) {
        redirect("/hris/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome!</h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Please change your default password before continuing to the dashboard.
                </p>
                <ChangePasswordForm />
            </div>
        </div>
    );
}