"use client";

import { changePassword, updateEmail } from "@/actions/employees/users/action";
import { useState, useEffect } from "react";

interface UserProps {
    user: any,
}

const DEFAULT_USER_DATA = {
    id: "", profile_picture: "", email: ""
}

export default function AccountSettingsPage({ user }: UserProps) {
    const [userData, setUserData] = useState({ ...DEFAULT_USER_DATA, ...(user || {}) });

    // --- State for Email Form ---
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [email, setEmail] = useState(userData.email || "");
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [emailMessage, setEmailMessage] = useState({ type: "", text: "" });

    // Keep email input in sync if user prop loads slightly later
    useEffect(() => {
        if (user?.email) setEmail(user.email);
    }, [user]);

    // --- State for Password Form ---
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isPassLoading, setIsPassLoading] = useState(false);
    const [passMessage, setPassMessage] = useState({ type: "", text: "" });


    // --- Handlers ---
    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEmailLoading(true);
        setEmailMessage({ type: "", text: "" });

        try {
            const res = await updateEmail(email);
            if (res.error) throw new Error(res.error);
            
            // Update UI, show success, and close edit mode
            setUserData({ ...userData, email: email });
            setEmailMessage({ type: "success", text: "Email updated successfully!" });
            setIsEditingEmail(false); 
        } catch (error: any) {
            setEmailMessage({ type: "error", text: error.message || "Failed to update email." });
        } finally {
            setIsEmailLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPassLoading(true);
        setPassMessage({ type: "", text: "" });

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPassMessage({ type: "error", text: "New passwords do not match." });
            setIsPassLoading(false);
            return;
        }

        try {
            const res = await changePassword(passwords.currentPassword, passwords.newPassword);
            if (res.error) throw new Error(res.error);
            setPassMessage({ type: "success", text: "Password changed successfully!" });
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" }); // clear form
        } catch (error: any) {
            setPassMessage({ type: "error", text: error.message || "Failed to change password." });
        } finally {
            setIsPassLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* PAGE HEADER */}
            <div className="border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Account Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account details and security preferences.</p>
            </div>

            <div className="space-y-6">

                {/* ACCOUNT INFORMATION SECTION */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header with Edit Button */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Account Information</h2>
                            <p className="text-xs text-gray-500">The email address associated with your account.</p>
                        </div>
                        {!isEditingEmail && (
                            <button
                                onClick={() => {
                                    setIsEditingEmail(true);
                                    setEmailMessage({ type: "", text: "" }); // clear old messages
                                }}
                                className="text-sm font-medium text-[#1a6b36] hover:underline"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                    
                    <div className="p-6">
                        {/* Email Success/Error Message */}
                        {emailMessage.text && (
                            <div className={`p-3 mb-4 text-sm rounded-lg ${emailMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {emailMessage.text}
                            </div>
                        )}

                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                            Email Address
                        </label>

                        {!isEditingEmail ? (
                            <div className="w-full md:w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 shadow-sm cursor-not-allowed">
                                {userData.email || "No email address provided."}
                            </div>
                        ) : (
                            <form onSubmit={handleEmailUpdate} className="flex flex-col gap-3 w-full md:w-1/2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all shadow-sm bg-white focus:ring-1 focus:border-green-500"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={isEmailLoading || email === userData.email || !email}
                                        className="bg-[#1a6b36] text-white text-sm font-medium px-6 py-2 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all disabled:opacity-50"
                                    >
                                        {isEmailLoading ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditingEmail(false);
                                            setEmail(userData.email); // reset input back to original
                                        }}
                                        className="bg-white text-gray-600 border border-gray-300 text-sm font-medium px-6 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* SECURITY SECTION */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-lg font-semibold text-gray-800">Security</h2>
                        <p className="text-xs text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
                    </div>
                    <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
                        {passMessage.text && (
                            <div className={`p-3 text-sm rounded-lg ${passMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {passMessage.text}
                            </div>
                        )}

                        <div className="space-y-4 md:w-1/2">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    required
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all shadow-sm bg-white focus:ring-1 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    required
                                    minLength={8}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all shadow-sm bg-white focus:ring-1 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    required
                                    minLength={8}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all shadow-sm bg-white focus:ring-1 focus:border-green-500"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isPassLoading || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
                                className="bg-[#1a6b36] text-white text-sm font-medium px-6 py-2 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all disabled:opacity-50"
                            >
                                {isPassLoading ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}