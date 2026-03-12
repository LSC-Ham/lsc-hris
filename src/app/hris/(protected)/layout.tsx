import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/hris/Sidebar";
import { LogoutButton } from "@/components/hris/auth/LogoutButton";
import { prisma } from "@/lib/prisma"; // ✨ Added Prisma import

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    // Single, clean check for session existence
    if (!session || !session.user) {
        redirect("/hris/login");
    }

    const userId = (session.user as any).id || "";
    const userRole = (session.user as any).role || "";

    const userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            profile_picture: true,
            biography: {
                select: {
                    personal_information: {
                        select: {
                            surname: true,
                        }
                    },
                    employees: {
                        select: {
                            id_number: true,

                            departments: {
                                select: {
                                    department: true,
                                }
                            }
                        }
                    }
                }
            }
        } 
    });

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar
                userRole={userRole}
                userId={userId}
                profilePicture={userData?.profile_picture || ""}
                surname={userData?.biography?.personal_information?.surname || ""}
                department={userData?.biography?.employees?.departments?.department || ""}
                idNumber={userData?.biography?.employees?.id_number || ""}
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
        </div>
    );
}