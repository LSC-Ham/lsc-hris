// src/app/hris/login/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import LoginPage from "./LoginPage";

export default async function Page() {
    const session = await getServerSession();

    if (session) {
        redirect("/hris/dashboard");
    }

    return <LoginPage />;
}