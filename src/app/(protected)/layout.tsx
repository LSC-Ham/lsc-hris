import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <section>
            <nav>
                Logged in as: {session.user?.name}
            </nav>
            {children}
        </section>
    );
}