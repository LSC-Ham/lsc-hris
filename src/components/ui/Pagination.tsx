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

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 0) return null;

    const skip = (currentPage - 1) * itemsPerPage;

    const btnBase = "px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200";
    
    const btnActive = "border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 shadow-sm active:scale-95";
    
    const btnDisabled = "border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-600 bg-slate-50 dark:bg-zinc-900/50 cursor-not-allowed";

    return (
        <div className="bg-white dark:bg-zinc-900 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
            <div className="text-sm text-gray-500 dark:text-zinc-400">
                Showing <span className="font-medium text-gray-900 dark:text-zinc-100">{skip + 1}</span> to{" "}
                <span className="font-medium text-gray-900 dark:text-zinc-100">
                    {Math.min(skip + itemsPerPage, totalItems)}
                </span>{" "}
                of <span className="font-medium text-gray-900 dark:text-zinc-100">{totalItems}</span> {itemName}
            </div>

            <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                    <Link
                        href={createPageURL(currentPage - 1)}
                        className={`${btnBase} ${btnActive}`}
                    >
                        Previous
                    </Link>
                ) : (
                    <button disabled className={`${btnBase} ${btnDisabled}`}>
                        Previous
                    </button>
                )}

                {currentPage < totalPages ? (
                    <Link
                        href={createPageURL(currentPage + 1)}
                        className={`${btnBase} ${btnActive}`}
                    >
                        Next
                    </Link>
                ) : (
                    <button disabled className={`${btnBase} ${btnDisabled}`}>
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}