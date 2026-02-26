'use client';

import React, { useState } from 'react';

interface NavbarProps {
    onToggleSidebar: () => void;
    onOpenPasswordModal: () => void;
}

export default function Navbar({ onToggleSidebar, onOpenPasswordModal }: NavbarProps) {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full z-[100] flex h-[70px] items-center justify-between border-b-[3px] border-[#0d5038] bg-gradient-to-r from-[#1a7f5c] to-[#2ecc71] px-4 md:px-5 shadow-[0_4px_20px_rgba(26,127,92,0.15)] text-white">
            <div className="flex items-center gap-3 md:gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="md:hidden flex items-center justify-center rounded-lg border border-white/30 bg-white/20 p-2 text-xl transition-all hover:scale-105 hover:bg-white/30"
                >
                    <i className="fas fa-bars"></i>
                </button>
                <img className="hidden h-[45px] w-[45px] rounded-full border-[3px] border-white object-cover shadow-md md:block" src="/img/nssc_logo.webp" alt="NSSC Logo" />
                <h1 className="m-0 text-[1.1rem] md:text-[1.4rem] font-semibold tracking-[0.5px] drop-shadow-md">
                    iLSCore - ADMISSION PORTAL
                </h1>
            </div>

            <ul className="m-0 flex list-none items-center gap-2 md:gap-4 p-0">
                <li className="hidden sm:block">
                    <h6 className="m-0 rounded-[20px] border border-white/20 bg-white/15 px-[15px] py-2 text-[0.95rem] font-medium tracking-[1px] text-white backdrop-blur-md">
                        WELCOME Lake Shoreans!
                    </h6>
                </li>

                <li className="relative">
                    <button
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        className="flex h-10 w-10 md:h-[45px] md:w-[45px] items-center justify-center rounded-full border-2 border-white bg-white text-[#1a7f5c] shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#0d5038] hover:text-white hover:shadow-md"
                    >
                        <i className="fa-sharp fa-solid fa-user"></i>
                    </button>

                    {isProfileDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-[200px] rounded-xl border border-[#e9ecef] bg-white py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                            <button
                                onClick={() => { onOpenPasswordModal(); setIsProfileDropdownOpen(false); }}
                                className="flex w-full items-center border-l-[3px] border-transparent px-5 py-3 text-left font-medium text-[#2c3e50] transition-all hover:border-[#1a7f5c] hover:bg-[#e8f5e9] hover:pl-6 hover:text-[#1a7f5c]"
                            >
                                <i className="fas fa-key mr-2.5 text-[#1a7f5c]"></i> Change Password
                            </button>
                            <button
                                onClick={() => console.log('Logout logic')}
                                className="flex w-full items-center border-l-[3px] border-transparent px-5 py-3 text-left font-medium text-[#2c3e50] transition-all hover:border-[#1a7f5c] hover:bg-[#e8f5e9] hover:pl-6 hover:text-[#1a7f5c]"
                            >
                                <i className="fas fa-sign-out-alt mr-2.5 text-[#1a7f5c]"></i> Logout
                            </button>
                        </div>
                    )}
                </li>
            </ul>
        </nav>
    );
}