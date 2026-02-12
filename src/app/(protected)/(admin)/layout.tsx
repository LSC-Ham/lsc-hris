import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import { redirect } from "next/navigation";

// Define which roles are allowed to enter this zone
const ALLOWED_ROLES = ["admin"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = (session.user as any).role;

    if (!ALLOWED_ROLES.includes(userRole)) {
        redirect("/dashboard");
    }

    return (
        <main>
            {children}
        </main>
    );
}