import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import UserDashboard from "./UserDashboard";
import { authOptions } from "@/lib/auth";
import HumanResourceDashboard from "./HumanResourceDashboard";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/hris/login");
    }
    
    const userId = (session.user as any).id || "";

    if (!userId) {
        redirect("/hris/login");
    }

    const currentEmployee = await prisma.employees.findFirst({
        where: { 
            biography: {
                users_id: userId 
            }
        },
        include: {
            departments: true,
            ranks: true
        }
    });

    if (!currentEmployee) {
        redirect("/hris/login"); 
    }

    const deptName = currentEmployee.departments?.department?.toLowerCase() || "";
    const rankName = currentEmployee.ranks?.rank?.toLowerCase() || "";

    const isHR = deptName.includes("human resource");
    const isVP = rankName.includes("vice president");

    if (isHR || isVP) {
        return <HumanResourceDashboard />;
    }

    return <UserDashboard userId={currentEmployee.id} />;
}