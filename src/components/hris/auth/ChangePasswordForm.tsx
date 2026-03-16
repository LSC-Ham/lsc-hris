// src/components/hris/auth/ChangePasswordForm.tsx
"use client";

import { useState } from "react";
import { setupFirstPassword } from "@/actions/users/action";
import { useRouter } from "next/navigation";

export default function ChangePasswordForm() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        const res = await setupFirstPassword(newPassword);

        if (res?.error) {
            setError(res.error);
            setIsLoading(false);
            return;
        }

        router.push("/hris/dashboard");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                    type="password"
                    required
                    minLength={8}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a6b36] focus:border-[#1a6b36] outline-none"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                    type="password"
                    required
                    minLength={8}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a6b36] focus:border-[#1a6b36] outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1a6b36] text-white py-2 px-4 rounded-lg hover:bg-[#135429] transition-colors disabled:opacity-50"
            >
                {isLoading ? "Saving..." : "Update Password"}
            </button>
        </form>
    );
}