import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import { redirect } from "next/navigation";

// Define which roles are allowed to enter this zone
const ALLOWED_ROLES = ["admin", "moderator"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/hris/login");
    }
    const userRole = (session.user as any).role;

    const role = ALLOWED_ROLES.includes(userRole)

    if (!role) {
        redirect("/hris/dashboard");
    }

    return (
        <main>
            {children}
        </main>
    );
}