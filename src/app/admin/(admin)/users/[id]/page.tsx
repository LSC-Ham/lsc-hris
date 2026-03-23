// src\app\admin\(admin)\users\[id]\page.tsx
import { getUsers } from "@/actions/users/action";
import AccountSettingsPage from "@/components/hris/account/AccountSettings";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id: id } = await params;
    const session = await getServerSession(authOptions);

    const userId = (session?.user as any).id || "";
    const userRole = (session?.user as any).role || "";

    const user = await getUsers(id);

    return <AccountSettingsPage
        user={user}
        currentUserId={userId}
        currentUserRole={userRole}
    />
}