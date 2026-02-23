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
    const userEmail = session.user.email;

    // ✨ Fetch the user's data from the database to get their profile picture
    // Note: Adjust "user" to match your actual Prisma model name (e.g., User, user)
    const userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            profile_picture: true,
            employees: {
                select: {
                    personal_information: {
                        select: {
                            surname: true,
                        }
                    }
                }
            }
        } // Only grab what we need for performance
    });

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* ✨ Pass the fetched profile picture to the Sidebar */}
            <Sidebar
                userRole={userRole}
                userId={userId}
                profilePicture={userData?.profile_picture || ""}
                surname={userData?.employees?.personal_information?.surname || ""}
            />

            <div className="flex-1 flex flex-col">

                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-sm font-semibold text-gray-500">
                        Welcome back, <span className="text-gray-900 capitalize">{userData?.employees?.personal_information?.surname}</span>
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