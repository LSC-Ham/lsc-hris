"use client";

import { signOut } from "next-auth/react";

export const LogoutButton = () => {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/hris/login" })}
            className="group cursor-pointer flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-red-50 hover:text-red-700 hover:border-red-200 hover:shadow transition-all duration-200 active:scale-95"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                stroke="currentColor"
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span>Sign Out</span>
        </button>
    );
};