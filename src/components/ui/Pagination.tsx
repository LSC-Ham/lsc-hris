// src/components/ui/Pagination.tsx
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
    totalPages,
    currentPage,
    totalItems,
    itemsPerPage = 10,
    itemName = "items",
}: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage?: number;
    itemName?: string;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Preserves any other URL parameters (like search filters) when changing pages
    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 0) return null;

    const skip = (currentPage - 1) * itemsPerPage;

    return (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{skip + 1}</span> to{" "}
                <span className="font-medium text-gray-900">
                    {Math.min(skip + itemsPerPage, totalItems)}
                </span>{" "}
                of <span className="font-medium text-gray-900">{totalItems}</span> {itemName}
            </div>

            <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                    <Link
                        href={createPageURL(currentPage - 1)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        Previous
                    </Link>
                ) : (
                    <button disabled className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
                        Previous
                    </button>
                )}

                {currentPage < totalPages ? (
                    <Link
                        href={createPageURL(currentPage + 1)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        Next
                    </Link>
                ) : (
                    <button disabled className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}