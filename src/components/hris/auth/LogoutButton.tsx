"use client";

import { signOut } from "next-auth/react";

export const LogoutButton = () => {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/hris/login" })}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200"
        >
            {/* Logout Icon */}
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-4 h-4"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span>Logout</span>
        </button>
    );
};