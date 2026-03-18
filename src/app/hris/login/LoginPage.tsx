// src/app/hris/login/LoginPage.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid username or password. Please try again.");
                setIsLoading(false);
            } else {
                router.push("/hris/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6 transition-colors duration-300">
            <div className="w-full max-w-sm bg-surface rounded-2xl shadow-md border border-divider overflow-hidden animate-in fade-in zoom-in-95 duration-300 transition-colors">

                <div className="px-8 pt-8 pb-6 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="relative w-24 h-24 transition-transform hover:scale-105 duration-300">
                            <img
                                src="/logo-sidebar.png"
                                alt="Lake Shore Colleges Logo"
                                className="object-contain w-full h-full drop-shadow-sm"
                            />
                        </div>
                    </div>
                    <h1 className="text-xl font-bold text-foreground tracking-tight">Welcome Back</h1>
                    <p className="text-sm text-muted mt-2">
                        Sign in to access your dashboard
                    </p>
                </div>

                <div className="px-8 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs font-medium flex items-center gap-2 animate-in slide-in-from-top-1">
                                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider">
                                Username or ID Number
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full pl-10 pr-4 py-2.5 border border-divider rounded-lg text-sm bg-background focus:bg-surface focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-muted text-foreground"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="block text-xs font-semibold text-muted uppercase tracking-wider">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 border border-divider rounded-lg text-sm bg-background focus:bg-surface focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-muted text-foreground"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand text-white font-medium py-2.5 px-4 rounded-lg hover:bg-brand-dark focus:ring-2 focus:ring-brand/50 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm flex justify-center items-center gap-2 mt-4"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-background px-8 py-4 border-t border-divider text-center transition-colors">
                    <p className="text-xs text-muted">
                        Don't have an account? <span className="text-brand font-semibold cursor-pointer hover:underline">Contact Admin</span>
                    </p>
                </div>
            </div>
        </div>
    );
}