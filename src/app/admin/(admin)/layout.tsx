import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/hris/auth/LogoutButton";

// Define which roles are allowed to enter this zone
const ALLOWED_ROLES = ["admin"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userId = (session.user as any).id || "";
    const userRole = (session.user as any).role || "";

    const role = ALLOWED_ROLES.includes(userRole)

    if (!role) {
        redirect("/");
    }

    const userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            profile_picture: true,
            password_changed: true,
            biography: {
                select: {
                    personal_information: {
                        select: {
                            surname: true,
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
        <main className="flex min-h-screen bg-slate-50">
            <Sidebar
                userRole={userRole}
                userId={userId}
                profilePicture={userData?.profile_picture || ""}
                surname={userData?.biography?.personal_information?.surname || ""}
            />
            <div className="flex-1 flex flex-col">

                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-sm font-semibold text-gray-500">
                        Welcome back, <span className="text-gray-900 capitalize">{userData?.biography?.personal_information?.surname}</span>
                    </h2>

                    <LogoutButton />
                </header>
                <main className="p-8">
                    {children}
                </main>
            </div>
        </main>
    );
}