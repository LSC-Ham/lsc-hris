import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/hris/Sidebar";
import { LogoutButton } from "@/components/hris/auth/LogoutButton";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) { 
    redirect("/hris/login");
}

    const userRole = (session.user as any).role || "";
    const userEmail = session.user.email;

    if (!session) {
        redirect("/hris/login");
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar userRole={userRole} />

            <div className="flex-1 flex flex-col">

                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-sm font-semibold text-gray-500">
                        Welcome back, <span className="text-gray-900">{userEmail}</span>
                    </h2>

                    <LogoutButton />
                </header>

                {/* Page Content */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}