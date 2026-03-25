import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/hris/Sidebar";
import { LogoutButton } from "@/components/hris/auth/LogoutButton";
import { prisma } from "@/lib/prisma";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/hris/login");
    }

    const userId = (session.user as any).id || "";
    const userRole = (session.user as any).role || "";

    const userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            password_changed: true,
            profile_picture: true,
            biography: {
                select: {
                    personal_information: {
                        select: { surname: true, }
                    },
                    employees: {
                        select: {
                            id_number: true, department_role: true, departments: {
                                select: { department: true }
                            }
                        }
                    }
                }
            }
        }
    });

    if (userData && userData.password_changed === false) {
        redirect("/hris/change-password");
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
            <Sidebar
                userRole={userRole}
                userId={userId}
                profilePicture={userData?.profile_picture || ""}
                surname={userData?.biography?.personal_information?.surname || ""}
                department={userData?.biography?.employees?.departments?.department || ""}
                idNumber={userData?.biography?.employees?.id_number || ""}
                departmentRole={userData?.biography?.employees?.department_role || ""}
            />

            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 hidden md:flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-zinc-400">
                        Welcome back, <span className="text-gray-900 dark:text-zinc-100 capitalize">{userData?.biography?.personal_information?.surname}</span>
                    </h2>

                    <div className="hidden lg:block">
                        <LogoutButton />
                    </div>
                </header>

                <main className="p-4 pt-20 md:p-8 md:pt-8">
                    {children}
                </main>
            </div>
        </div>
    );
}