import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const ALLOWED_DEPARTMENTS = ["human resource"];
const ALLOWED_RANKS = ["vice president"]

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/hris/login");
    }
    const userId = (session.user as any).id;

    const userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            biography: {
                select: {
                    employees: {
                        select: {
                            departments: { select: { department: true } },
                            ranks: {
                                select: {
                                    rank: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const role = ALLOWED_DEPARTMENTS.includes(userData?.biography?.employees?.departments?.department.toLowerCase() || "")
    const rank = ALLOWED_RANKS.includes(userData?.biography?.employees?.ranks?.rank.toLowerCase() || "")


    if (!role && !rank) {
        redirect("/hris/dashboard");
    }

    return (
        <main>
            {children}
        </main>
    );
}