'use client';

import React from 'react';

interface SidebarProps {
    isOpen: boolean;
    activePath: string;
    onNavigate: (path: string) => void;
}

export default function Sidebar({ isOpen, activePath, onNavigate }: SidebarProps) {
    const navItems = [
        { id: 'Dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
        { id: 'Colleges', icon: 'fa-university', label: 'Colleges' },
        { id: 'SeniorHigh', icon: 'fa-user-graduate', label: 'Senior High' },
        { id: 'KinderG10', icon: 'fa-child', label: 'Kinder to G10' },
    ];

    return (
        <aside className={`fixed top-[70px] left-0 z-[90] h-[calc(100%-70px)] w-[280px] overflow-y-auto border-r border-[#e9ecef] bg-white p-5 shadow-[5px_0_25px_rgba(46,204,113,0.1)] transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="mb-[30px] flex justify-center border-b-2 border-[#e8f5e9] pb-5">
                <img src="/img/nssc_logo.webp" className="h-[100px] w-[100px] md:h-[120px] md:w-[120px] rounded-full border-[5px] border-[#e8f5e9] bg-white object-cover shadow-[0_8px_25px_rgba(26,127,92,0.2)] transition-transform hover:scale-105" alt="NSSC Logo" />
            </div>

            <h3 className="mb-[30px] border-b-2 border-dashed border-[#e9ecef] pb-[15px] text-center text-[1.2rem] font-semibold text-[#1a7f5c]">
                <i className="fa-sharp fa-regular fa-user mr-2.5 text-[#2ecc71]"></i> ADMISSION PANEL
            </h3>

            <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`flex w-full items-center rounded-xl p-3.5 px-5 font-medium transition-all duration-300 ${activePath === item.id
                                ? 'bg-gradient-to-r from-[#1a7f5c] to-[#2ecc71] text-white border-l-[4px] border-[#0d5038] shadow-[0_5px_15px_rgba(26,127,92,0.3)]'
                                : 'bg-[#f8f9fa] text-[#2c3e50] border-l-[4px] border-transparent shadow-[0_3px_8px_rgba(0,0,0,0.05)] hover:translate-x-2 hover:border-[#1a7f5c] hover:bg-gradient-to-r hover:from-[#e8f5e9] hover:to-white hover:text-[#1a7f5c] hover:shadow-[0_5px_15px_rgba(46,204,113,0.2)]'
                            }`}
                    >
                        <i className={`fas ${item.icon} mr-3 w-5 text-center ${activePath === item.id ? 'text-white' : 'text-[#1a7f5c]'}`}></i>
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}