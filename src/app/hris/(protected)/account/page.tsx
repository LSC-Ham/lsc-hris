import { getUsers } from "@/actions/employees/users/action";
import AccountSettingsPage from "@/components/hris/account/AccountSettings";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


//src\app\hris\(protected)\account\page.tsx
export default async function Page() {
    const session = await getServerSession(authOptions);

    const userId = (session?.user as any).id || "";

    const user = await getUsers(userId);

    return <AccountSettingsPage user={user} />
}