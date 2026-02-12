"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// ... (Your existing navItems array stays here) ...
const navItems = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: (isActive: boolean) => (
            <svg className={`w-5 h-5 ${isActive ? "text-[#1a6b36]" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        )
    },
    {
        name: "Profile",
        href: "/profile",
        icon: (isActive: boolean) => (
            <svg className={`w-5 h-5 ${isActive ? "text-[#1a6b36]" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        )
    },
    {
        name: "Admin Panel",
        href: "/admin",
        adminOnly: true,
        icon: (isActive: boolean) => (
            <svg className={`w-5 h-5 ${isActive ? "text-[#1a6b36]" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        )
    }
];

export function Sidebar({ userRole }: { userRole: string }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar automatically when user clicks a link
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            {/* 1. MOBILE HEADER & HAMBURGER BUTTON */}
            {/* Only visible on Mobile (md:hidden) */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center px-4 justify-between">
                <span className="font-bold text-lg text-gray-800">LSC HRIS</span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                >
                    {/* Hamburger Icon */}
                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>

            {/* 2. OVERLAY (Backdrop) */}
            {/* Clicking this closes the sidebar on mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* 3. SIDEBAR CONTAINER */}
            {/* Mobile: Fixed position, slides in/out using translate-x
          Desktop: Static position, always visible (md:translate-x-0)
      */}
            <aside className={`
        /* MOBILE STYLES: Fixed off-screen */
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        
        /* DESKTOP STYLES (The Fix) */
        md:translate-x-0 
        md:sticky        /* Was md:static */
        md:top-0         /* Pins it to the top */
        md:h-screen      /* Forces it to be full height of the viewport */

        flex flex-col
      `}>

                {/* Header / Logo (Visible on Desktop) */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="w-8 h-8 bg-[#1a6b36] rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <span className="font-bold text-xl text-gray-800 tracking-tight">LSC HRIS</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        if (item.adminOnly && !["admin", "SUPER_ADMIN", "HR_ADMIN"].includes(userRole)) {
                            return null;
                        }
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${isActive
                                    ? "bg-green-50 text-[#1a6b36] border border-green-100"
                                    : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                                    }`}
                            >
                                {item.icon(isActive)}
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                            U
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-700 uppercase">My Account</span>
                            <span className="text-[10px] text-gray-400">{userRole}</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}