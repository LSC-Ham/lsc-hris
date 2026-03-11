"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchFilterBar } from "../SearchFilter";

export default function StudentSearchClient({ initialSearch }: { initialSearch: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleFilterChange = (filters: { search: string; acad_year: string; semester: string }) => {
        const params = new URLSearchParams(searchParams.toString());

        if (filters.search) {
            params.set("search", filters.search);
            params.set("page", "1"); // Reset pagination when searching
        } else {
            params.delete("search");
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="mb-6">
            <SearchFilterBar
                initialSearch={initialSearch}
                showAcadYear={false} // Hides Acad Year based on your existing prop
                showSemester={false} // Hides Semester based on your existing prop
                onFilterChange={handleFilterChange}
            />
        </div>
    );
}