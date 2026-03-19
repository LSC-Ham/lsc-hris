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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

                <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">{title}</h2>
                        {subtitle && <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isConfirming}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                        {message}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isConfirming}
                            className="flex-1 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-700 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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