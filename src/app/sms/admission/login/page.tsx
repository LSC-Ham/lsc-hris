'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const currentYear = new Date().getFullYear();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulating a network request
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5f7fa] to-[#e4efe9] p-4 md:p-5">

            {/* Background Image Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center brightness-105"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.92)), url('/lsc_background.jpg')`
                }}
            />

            {/* LSC Background Text */}
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center opacity-10">
                <h1 className="mb-5 text-center font-[Times_New_Roman] text-[2.5rem] font-bold uppercase leading-tight tracking-[2px] text-[#2d6a4f] md:text-6xl md:tracking-[4px]">
                    LAKE<br />SHORE<br />COLLEGES
                </h1>
                <div className="font-serif text-lg italic tracking-[2px] text-[#1b4332] md:text-3xl">PRO PATRIA</div>
                <div className="mt-2.5 font-sans text-sm tracking-[1px] text-[#40916c] md:text-lg">FOUNDED A.D. 1931</div>
            </div>

            {/* Login Form Container */}
            <div className="relative z-20 w-full max-w-[420px]">

                {/* Login Card */}
                <div className="rounded-[20px] border border-[#40916c]/20 bg-white/95 p-6 shadow-[0_15px_35px_rgba(45,106,79,0.1),0_5px_15px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(45,106,79,0.15),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-8 md:px-[35px] md:py-[40px]">

                    {/* Logo */}
                    <div className="mb-[30px] flex justify-center">
                        <img
                            src="/logo-sidebar.png"
                            alt="Lake Shore Colleges Logo"
                            className="h-[75px] w-[75px] object-contain drop-shadow-[0_4px_6px_rgba(45,106,79,0.2)] md:h-[90px] md:w-[90px]"
                        />
                    </div>

                    {/* Title */}
                    <h2 className="relative mb-[30px] pb-[15px] text-center text-[1.4rem] font-semibold text-[#2d6a4f] after:absolute after:bottom-0 after:left-1/2 after:h-[3px] after:w-[60px] after:-translate-x-1/2 after:rounded-sm after:bg-gradient-to-r after:from-[#2d6a4f] after:to-[#52b788] md:text-[1.8rem]">
                        Welcome Back
                    </h2>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit}>

                        {/* Username Field */}
                        <div className="mb-[25px]">
                            <label className="mb-2 flex items-center gap-2 text-[0.95rem] font-medium text-[#2d6a4f]" htmlFor="username">
                                <i className="fa-regular fa-user text-[1rem] text-[#40916c]"></i> Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter your username"
                                required
                                className="w-full rounded-xl border-2 border-[#e9f5ec] bg-[#f8fdf9] px-[14px] py-[12px] text-base text-[#2d6a4f] transition-all duration-300 placeholder:text-[#95d5b2] focus:border-[#52b788] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#52b788]/20 md:px-[16px] md:py-[14px]"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="mb-[25px]">
                            <label className="mb-2 flex items-center gap-2 text-[0.95rem] font-medium text-[#2d6a4f]" htmlFor="password">
                                <i className="fa-solid fa-lock text-[1rem] text-[#40916c]"></i> Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-xl border-2 border-[#e9f5ec] bg-[#f8fdf9] px-[14px] py-[12px] text-base text-[#2d6a4f] transition-all duration-300 placeholder:text-[#95d5b2] focus:border-[#52b788] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#52b788]/20 md:px-[16px] md:py-[14px]"
                            />
                        </div>

                        {/* Login Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-2.5 flex w-full items-center justify-center gap-[10px] rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#40916c] p-[14px] text-[1rem] font-semibold text-white shadow-[0_4px_15px_rgba(45,106,79,0.3)] transition-all duration-300 hover:-translate-y-[2px] hover:bg-gradient-to-br hover:from-[#1b4332] hover:to-[#2d6a4f] hover:shadow-[0_6px_20px_rgba(45,106,79,0.4)] active:translate-y-0 md:p-[16px] md:text-[1.05rem]"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                ) : (
                                    <>
                                        <i className="fa-solid fa-right-to-bracket text-[1.1rem]"></i> Login
                                    </>
                                )}
                            </button>
                        </div>

                    </form>

                    {/* Forgot Password */}
                    <div className="mt-[25px] border-t border-[#40916c]/10 pt-[20px] text-center">
                        <Link
                            href="/forgot-password"
                            className="text-[0.9rem] text-[#40916c] transition-colors duration-300 hover:text-[#2d6a4f] hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Footer */}
                    <div className="mt-[30px] text-center text-[0.85rem] text-[#74c69d] opacity-80">
                        &copy; {currentYear} Lake Shore Colleges. All rights reserved.
                    </div>

                </div>
            </div>
        </div>
    );
}