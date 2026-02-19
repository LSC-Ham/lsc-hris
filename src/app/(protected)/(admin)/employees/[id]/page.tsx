import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// 1. Update the Interface: params is now a Promise
interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EmployeeDetailPage(props: PageProps) {
    const params = await props.params;
    const userId = params.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <h1 className="text-3xl font-bold text-gray-800">
                User: {user.email}
            </h1>
        </div>
    );
}