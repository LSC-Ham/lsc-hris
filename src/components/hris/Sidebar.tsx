"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ProfilePictureUpload from "../profile/ProfilePictureUpload";
import Image from "next/image";

interface SidebarProps {
    userRole: string;
    userId: string;
    profilePicture: string;
    surname: string;
    department?: string;
    idNumber: string;
}

export function Sidebar({ userRole, userId, profilePicture, surname, department, idNumber }: SidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const isAdminActive = pathname.startsWith("/admin");

    // Centralized styling for cleaner mapping
    const activeLinkStyles = "bg-green-50 text-[#1a6b36] border border-green-100 shadow-sm dark:bg-[#1a6b36]/20 dark:text-green-400 dark:border-green-400/20";
    const inactiveLinkStyles = "text-gray-600 hover:bg-slate-50 hover:text-gray-900 border border-transparent dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100";

    const activeIconStyles = "text-[#1a6b36] dark:text-green-400";
    const inactiveIconStyles = "text-gray-400 dark:text-zinc-500";

    const navItems = [
        {
            name: "Dashboard",
            href: "/hris/dashboard",
            icon: (isActive: boolean) => (
                <svg className={`w-5 h-5 ${isActive ? activeIconStyles : inactiveIconStyles}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            name: "Employees",
            href: "/hris/employees",
            hrOnly: true,
            icon: (isActive: boolean) => (
                <svg className={`w-5 h-5 ${isActive ? activeIconStyles : inactiveIconStyles}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            name: "System Settings",
            href: "/hris/settings",
            roles: true,
            icon: (isActive: boolean) => (
                <svg className={`w-5 h-5 ${isActive ? activeIconStyles : inactiveIconStyles}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        { type: "label", name: "ACCOUNTS" },
        {
            name: "Profile",
            href: `/hris/${idNumber}`,
            icon: (isActive: boolean) => (
                <svg className={`w-5 h-5 ${isActive ? activeIconStyles : inactiveIconStyles}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            name: "Settings",
            href: "/hris/account",
            icon: (isActive: boolean) => (
                <svg className={`w-5 h-5 ${isActive ? activeIconStyles : inactiveIconStyles}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
    ];

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 z-40 flex items-center px-4 gap-2 transition-colors duration-200">
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none transition-colors">
                    <svg className="w-6 h-6 text-gray-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-zinc-400">
                    Welcome back, <span className="text-gray-900 dark:text-zinc-100 capitalize">{surname}</span>
                </h2>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setIsOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transform transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:sticky md:top-0 md:h-screen md:min-w-64 flex flex-col`}>

                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-zinc-800/50">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                        <div className="relative w-8 h-8">
                            <Image src="/logo-sidebar.png" alt="HRIS Logo" fill className="object-contain" priority />
                        </div>
                    </div>
                    <span className="font-bold text-xl text-gray-800 dark:text-zinc-100 tracking-tight">LSC HRIS</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item, index) => {
                        if (item.type === "label") {
                            return (
                                <div key={`label-${index}`} className="px-4 pt-6 pb-2">
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{item.name}</span>
                                </div>
                            );
                        }

                        if (item.hrOnly && !["human resource"].includes(department?.toLowerCase() || "")) return null;
                        if (item.roles && !["admin", "moderator"].includes(userRole)) return null;

                        const isActive = pathname.startsWith(item.href || "#");

                        return (
                            <Link key={item.name} href={item.href || "#"} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive ? activeLinkStyles : inactiveLinkStyles}`}>
                                {item.icon && item.icon(isActive)}
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Admin Panel Link */}
                {userRole === "admin" && (
                    <div className="px-4 py-2 border-t border-gray-50 dark:border-zinc-800/50">
                        <Link
                            href="/admin/dashboard"
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isAdminActive ? activeLinkStyles : inactiveLinkStyles}`}
                        >
                            <svg className={`w-5 h-5 ${isAdminActive ? activeIconStyles : inactiveIconStyles}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Admin Panel
                        </Link>
                    </div>
                )}

                {/* Profile Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 font-bold border border-gray-200 dark:border-zinc-700 overflow-hidden shadow-sm">
                            <ProfilePictureUpload userId={userId} initialImage={profilePicture} size="sm" isEditable={false} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-700 dark:text-zinc-200 uppercase truncate max-w-[120px]">{surname}</span>
                            <span className="text-[10px] text-gray-400 dark:text-zinc-500 capitalize">{userRole}</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}