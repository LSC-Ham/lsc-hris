import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const ALLOWERED_ROLES = ["head", "assistant head"];
const ALLOWERED_RANKS = ["vice president"];

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/hris/login");
    }
    const userId = (session.user as any).id;

    const userData = await prisma.user.findUnique({
        where: { id: userId },
        select: { biography: { select: { employees: { select: { department_role: true, ranks: { select: { rank: true } } } } } } }
    });

    const role = ALLOWERED_ROLES.includes(userData?.biography?.employees?.department_role?.toLowerCase() || "")
    const rank = ALLOWERED_RANKS.includes(userData?.biography?.employees?.ranks?.rank.toLocaleLowerCase() || "")

    if (!role && rank) {
        redirect("/hris/dashboard");
    }

    return (
        <main>
            {children}
        </main>
    );
}