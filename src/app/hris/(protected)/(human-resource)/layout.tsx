import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const ALLOWED_DEPARTMENTS = ["human resource"];

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/hris/login");
    }
    const userId = (session.user as any).id;

    const userData = await prisma.user.findUnique({
        where: { id: userId },
        select: { biography: { select: { employees: { select: { departments: { select: { department: true } } } } } } }
    });

    const role = ALLOWED_DEPARTMENTS.includes(userData?.biography?.employees?.departments?.department.toLowerCase() || "")

    if (!role) {
        redirect("/hris/dashboard");
    }

    return (
        <main>
            {children}
        </main>
    );
}