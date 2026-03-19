"use client";

import { useState } from "react";

interface AccountDangerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (action: "deactivate" | "delete", confirmText: string) => void;
    targetUsername: string;
}

export default function AccountDangerModal({ isOpen, onClose, onConfirm, targetUsername }: AccountDangerModalProps) {
    const [selectedAction, setSelectedAction] = useState<"deactivate" | "delete" | null>(null);
    const [confirmText, setConfirmText] = useState("");

    const handleClose = () => {
        setSelectedAction(null);
        setConfirmText("");
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedAction && confirmText === targetUsername) {
            onConfirm(selectedAction, confirmText);
        }
    };

    if (!isOpen) return null;

    const isTextMatching = confirmText === targetUsername;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">Account Management</h2>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Please select an action below.</p>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-3">
                        {/* Deactivate Option */}
                        <label className={`block border rounded-lg p-4 cursor-pointer transition-all ${selectedAction === "deactivate"
                                ? "border-orange-500 bg-orange-50/50 dark:bg-orange-500/10 ring-1 ring-orange-500"
                                : "border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                            }`}>
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="account_action"
                                    value="deactivate"
                                    checked={selectedAction === "deactivate"}
                                    onChange={() => setSelectedAction("deactivate")}
                                    className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 dark:border-zinc-700 dark:bg-zinc-800"
                                />
                                <div>
                                    <span className="block text-sm font-semibold text-gray-900 dark:text-zinc-100">Deactivate Account</span>
                                    <span className="block text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Temporarily disable this account.</span>
                                </div>
                            </div>
                        </label>

                        {/* Delete Option */}
                        <label className={`block border rounded-lg p-4 cursor-pointer transition-all ${selectedAction === "delete"
                                ? "border-red-500 bg-red-50/50 dark:bg-red-500/10 ring-1 ring-red-500"
                                : "border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                            }`}>
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="account_action"
                                    value="delete"
                                    checked={selectedAction === "delete"}
                                    onChange={() => setSelectedAction("delete")}
                                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 dark:border-zinc-700 dark:bg-zinc-800"
                                />
                                <div>
                                    <span className="block text-sm font-semibold text-gray-900 dark:text-zinc-100">Delete Account</span>
                                    <span className="block text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Permanently remove this user. Cannot be undone.</span>
                                </div>
                            </div>
                        </label>
                    </div>

                    {selectedAction && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300 bg-gray-50 dark:bg-zinc-950 p-4 rounded-lg border border-gray-200 dark:border-zinc-800">
                            <label className="block text-sm text-gray-700 dark:text-zinc-300">
                                To verify, type <strong className="font-bold text-gray-900 dark:text-white select-all">{targetUsername}</strong> below:
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                required
                                autoComplete="off"
                                className="w-full p-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all shadow-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-gray-200 dark:focus:ring-zinc-800"
                            />
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-700 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedAction || !isTextMatching}
                            className={`flex-1 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed
                            ${selectedAction === 'delete' ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600' :
                                    selectedAction === 'deactivate' ? 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600' :
                                        'bg-gray-400 dark:bg-zinc-700'}
                        `}
                        >
                            {selectedAction === 'delete' ? 'Permanently Delete' : selectedAction === 'deactivate' ? 'Deactivate Now' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}