"use client";

import { signOut } from "next-auth/react";

export const LogoutButton = () => {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/hris/login" })}
            className="bg-red-600 px-4 py-2 text-white rounded hover:bg-red-700"
        >
            Logout
        </button>
    );
};