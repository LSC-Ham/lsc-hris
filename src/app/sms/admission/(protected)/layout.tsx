'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Assuming Next.js
import Navbar from '@/components/sms/Navbar';
import Sidebar from '@/components/sms/Sidebar';
import ChangePasswordModal from '@/components/sms/ChangePasswordModal';
// import { useAuth } from '@/hooks/useAuth'; // Your auth context/hook

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    // 1. Check Auth Status (Example)
    // const { user, isLoading } = useAuth(); 
    const router = useRouter();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [activePath, setActivePath] = useState('Dashboard');

    // 2. The "Guard" Redirect
    /*
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login'); // Kick them out if not logged in
        }
    }, [user, isLoading, router]);

    // Show a full-screen loader while checking auth state
    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">Loading...</div>;
    }

    // Don't render the layout at all if there's no user
    if (!user) return null; 
    */

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#2c3e50] font-sans flex flex-col">
            <Navbar
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
            />

            <Sidebar
                isOpen={isSidebarOpen}
                activePath={activePath}
                onNavigate={(path) => {
                    setActivePath(path);
                    setIsSidebarOpen(false);
                }}
            />

            <main className="mt-[70px] flex-grow p-4 md:ml-[280px] md:p-[30px] transition-all duration-300">
                {children}
            </main>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
}