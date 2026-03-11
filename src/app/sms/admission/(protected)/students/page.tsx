import StudentsTable from "@/components/sms/admission/students/StudentsTable";
import StudentSearchClient from "@/components/sms/admission/StudentSearchClient";
import Pagination from "@/components/ui/Pagination";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const resolvedSearchParams = await searchParams;

    const ITEMS_PER_PAGE = 10;
    const currentPage = Number(resolvedSearchParams?.page) || 1;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;

    const searchQuery = resolvedSearchParams?.search || "";

    const whereCondition = searchQuery ? {
        OR: [
            { id_number: { contains: searchQuery, mode: "insensitive" as const } },
            {
                biography: {
                    personal_information: {
                        OR: [
                            { firstname: { contains: searchQuery, mode: "insensitive" as const } },
                            { surname: { contains: searchQuery, mode: "insensitive" as const } }
                        ]
                    }
                }
            }
        ]
    } : {};

    const [studentsList] = await Promise.all([
        prisma.students.findMany({
            where: whereCondition,
            distinct: ['id_number'],
            skip: skip,
            take: ITEMS_PER_PAGE,
            include: {
                biography: {
                    select: {
                        personal_information: {
                            select: {
                                firstname: true,
                                middlename: true,
                                surname: true,
                                mobile_no: true,
                            }
                        },
                    }
                }
            },
            orderBy: {
                created_at: "desc",
            },
        })
    ]);

    const totalPages = Math.ceil(studentsList.length / ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Student Directory</h1>
                    <p className="text-sm text-gray-500">Manage and view all student information.</p>
                </div>
                <Link
                    href="./create"
                    className="bg-[#1a6b36] hover:bg-[#155a2b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm text-center w-full md:w-auto"
                >
                    + Add Student
                </Link>
            </div>

            <div className="">
                <StudentSearchClient initialSearch={searchQuery} />

            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <StudentsTable studentsList={studentsList} />

                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    totalItems={studentsList.length}
                    itemName="students"
                />
            </div>
        </div>
    );
}