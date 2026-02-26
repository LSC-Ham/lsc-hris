'use client';

import React from 'react';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-[15px] bg-white shadow-2xl">
                <div className="flex items-center justify-between bg-gradient-to-br from-[#1a7f5c] to-[#0d5038] p-5 text-white">
                    <h5 className="text-xl font-semibold m-0">
                        <i className="fas fa-key mr-2"></i> Change Password
                    </h5>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors text-2xl leading-none">&times;</button>
                </div>

                <div className="p-[25px]">
                    <form onSubmit={(e) => { e.preventDefault(); console.log('Saved'); onClose(); }}>
                        <div className="mb-5 flex flex-col md:flex-row md:items-center">
                            <label className="mb-2 font-medium text-[#2c3e50] md:mb-0 md:w-1/3">Current Password:</label>
                            <input className="md:w-2/3 w-full rounded-lg border border-[#e9ecef] p-3 transition-all focus:border-[#2ecc71] focus:outline-none focus:ring-4 focus:ring-[#2ecc71]/20" type="password" required />
                        </div>
                        <div className="mb-5 flex flex-col md:flex-row md:items-start">
                            <label className="mb-2 mt-3 font-medium text-[#2c3e50] md:mb-0 md:w-1/3">New Password:</label>
                            <div className="md:w-2/3">
                                <input className="w-full rounded-lg border border-[#e9ecef] p-3 transition-all focus:border-[#2ecc71] focus:outline-none focus:ring-4 focus:ring-[#2ecc71]/20" type="password" required />
                                <small className="mt-1 block text-sm text-gray-500">Must be at least 8 characters</small>
                            </div>
                        </div>
                        <div className="mb-[30px] flex flex-col md:flex-row md:items-center">
                            <label className="mb-2 font-medium text-[#2c3e50] md:mb-0 md:w-1/3">Confirm Password:</label>
                            <input className="md:w-2/3 w-full rounded-lg border border-[#e9ecef] p-3 transition-all focus:border-[#2ecc71] focus:outline-none focus:ring-4 focus:ring-[#2ecc71]/20" type="password" required />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="rounded-lg bg-[#2ecc71] px-10 py-3 font-bold text-white transition-all hover:-translate-y-[2px] hover:bg-[#0d5038] hover:shadow-[0_5px_15px_rgba(13,80,56,0.2)]">
                                <i className="fas fa-key mr-2"></i> Save Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}