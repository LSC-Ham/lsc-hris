import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/sms/admission/Sidebar";
import { LogoutButton } from "@/components/sms/auth/LogoutButton";

// Ensure your departments are exactly as they appear in the database
const ALLOWED_DEPARTMENTS = ["office of the student affairs"];

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/sms/admission/login");
    }

    const userId = (session.user as any).id || "";
    const userRole = (session.user as any).role || "";

    // Grab the department from the token/session
    const userDepartment = (session.user as any).department || "";

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

    // 🛡️ SECURITY CHECK: Normalize to lowercase to avoid case-sensitivity bugs (e.g. "Office" vs "office")
    const isAllowed = ALLOWED_DEPARTMENTS.includes(userDepartment.toLowerCase().trim());

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
                    {isAllowed ? (
                        children
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl border border-gray-200 shadow-sm text-center p-8">
                            <div className="bg-red-50 p-4 rounded-full mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
                            <p className="text-gray-500 max-w-md">
                                You do not have permission to view the Admission Dashboard. This area is strictly restricted to personnel in the <span className="font-semibold text-gray-700 capitalize">{ALLOWED_DEPARTMENTS.join(", ")}</span>.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}