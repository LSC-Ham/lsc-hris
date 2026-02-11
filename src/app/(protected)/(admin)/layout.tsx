import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import { redirect } from "next/navigation";

// Define which roles are allowed to enter this zone
const ALLOWED_ROLES = ["admin"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    // 1. Double check they are logged in (Safety net)
    if (!session?.user) {
        redirect("/login");
    }

    // 2. THE ROLE CHECK
    // If their role is NOT in the allowed list, kick them to dashboard
    // Note: We cast to 'any' because default NextAuth types might not have 'role' yet
    const userRole = (session.user as any).role;

    if (!ALLOWED_ROLES.includes(userRole)) {
        // Optional: You could redirect to a specific "Unauthorized" page
        // For now, just send them back to the safe dashboard
        redirect("/dashboard");
    }

    // 3. If they pass, render the Admin pages
    return (
        <div className="flex flex-col min-h-screen">
            {/* Optional: Add a special Admin Sub-Navbar here */}
            <div className="bg-red-800 text-white text-xs p-1 text-center font-bold">
                ADMINISTRATION ZONE
            </div>

            {children}
        </div>
    );
}