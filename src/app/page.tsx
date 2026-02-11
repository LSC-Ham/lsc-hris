import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  // 1. Check if the user has a valid session (Database check happens inside here)
  const session = await getServerSession(authOptions);

  // 2. Decide where to send them
  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  // This return is unreachable because of the redirects, 
  // but Typescript might want a valid component return.
  return null;
}