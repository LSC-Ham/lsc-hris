// src/app/(protected)/(admin)/users/page.tsx
import UsersTable from "@/components/admin/users/UsersTable";
import Pagination from "@/components/ui/Pagination";
import { prisma } from "@/lib/prisma";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    // 1. Await the searchParams Promise
    const resolvedSearchParams = await searchParams;

    // 2. Pagination Setup
    const ITEMS_PER_PAGE = 10;
    const currentPage = Number(resolvedSearchParams?.page) || 1;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;

    // 3. Fetch users with pagination and total count in parallel
    const [usersLists, totalUsers] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: ITEMS_PER_PAGE,
            include: {
                biography: {
                    select: {
                        employees: {
                            select: {
                                id_number: true,
                            }
                        },
                        personal_information: {
                            select: {
                                surname: true,
                                firstname: true,
                                middlename: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: "desc",
            },
        }),
        prisma.user.count()
    ]);

    // 4. Calculate total pages
    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Users Directory</h1>
                    <p className="text-sm text-gray-500">Manage and view all users records.</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <UsersTable usersLists={usersLists} />

                {/* Pagination rendered at the bottom of the table container */}
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    totalItems={totalUsers}
                    itemName="users"
                />
            </div>
        </div>
    );
}