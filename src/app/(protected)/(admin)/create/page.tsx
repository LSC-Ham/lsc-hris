"use client";

import { createUser } from "@/actions/create-user";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
    const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const result = await createUser(formData);

        setIsLoading(false);
        setMessage(result);

        if (result.success) {
            // Optional: Clear form or redirect
            (event.target as HTMLFormElement).reset();
            // router.push("/dashboard/users"); // Redirect if you want
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New User</h2>

            {/* Feedback Messages */}
            {message?.error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">
                    {message.error}
                </div>
            )}
            {message?.success && (
                <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm border border-green-200">
                    {message.success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        name="username"
                        type="text"
                        required
                        className="mt-1 block w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        className="mt-1 block w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Initial Password</label>
                    <input
                        name="password"
                        type="password" // Use type="text" if you want to see the temporary password
                        required
                        className="mt-1 block w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        name="role"
                        className="mt-1 block w-full rounded border border-gray-300 p-2 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="EMPLOYEE">Employee</option>
                        <option value="HR_ADMIN">HR Admin</option>
                        <option value="MANAGER">Manager</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {isLoading ? "Creating..." : "Create Account"}
                </button>
            </form>
        </div>
    );
}