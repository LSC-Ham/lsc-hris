"use client";

import React from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    subtitle?: string; 
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    isConfirming?: boolean; 
    confirmColorClass?: string; 
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    subtitle,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isConfirming = false,
    confirmColorClass = "bg-[#1a6b36] hover:bg-[#155a2b]",
}: ConfirmModalProps) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isConfirming}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-sm text-gray-600 leading-relaxed">
                        {message}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isConfirming}
                            className="flex-1 bg-white text-gray-700 border border-gray-300 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isConfirming}
                            className={`flex-1 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${confirmColorClass}`}
                        >
                            {isConfirming ? (
                                <>
                                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                    Processing...
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}