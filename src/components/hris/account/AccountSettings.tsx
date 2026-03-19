"use client";

import { useState, useEffect } from "react";
import AccountDangerModal from "./AccountDangerModal";
import { deactivateOrDeleteAccount } from "@/actions/admin/users/action";
import { changePassword, updateEmail, updateRole, updateUsername } from "@/actions/users/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserProps {
    user: any;
    currentUserId: string;
    currentUserRole: string;
}

const DEFAULT_USER_DATA = {
    id: "", profile_picture: "", email: "", username: "", role: "user"
}

export default function AccountSettingsPage({ user, currentUserId, currentUserRole }: UserProps) {
    const [userData, setUserData] = useState({ ...DEFAULT_USER_DATA, ...(user || {}) });
    const router = useRouter();

    const isEditingSelf = userData.id === currentUserId;
    const isCurrentUserAdmin = currentUserRole === "admin";
    const canEditRole = isCurrentUserAdmin && !isEditingSelf;

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        username: userData.username || "",
        role: userData.role || "user"
    });
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [email, setEmail] = useState(userData.email || "");
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [emailMessage, setEmailMessage] = useState({ type: "", text: "" });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isPassLoading, setIsPassLoading] = useState(false);
    const [passMessage, setPassMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username || "",
                role: user.role || "user"
            });
            setEmail(user.email || "");
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProfileLoading(true);
        setProfileMessage({ type: "", text: "" });

        try {
            if (profileData.username !== userData.username) {
                const userRes = await updateUsername(user.id, profileData.username);
                if (userRes?.error) throw new Error(userRes.error);
            }

            if (profileData.role !== userData.role && canEditRole) {
                const roleRes = await updateRole(user.id, profileData.role);
                if (roleRes?.error) throw new Error(roleRes.error);
            }

            setUserData({ ...userData, username: profileData.username, role: profileData.role });
            setProfileMessage({ type: "success", text: "Profile updated successfully!" });
            setIsEditingProfile(false);
        } catch (error: any) {
            setProfileMessage({ type: "error", text: error.message || "Failed to update profile details." });
        } finally {
            setIsProfileLoading(false);
        }
    };

    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEmailLoading(true);
        setEmailMessage({ type: "", text: "" });

        try {
            const res = await updateEmail(user.id, email);
            if (res?.error) throw new Error(res.error);

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
            const res = await changePassword(user.id, passwords.currentPassword, passwords.newPassword);
            if (res?.error) throw new Error(res.error);
            setPassMessage({ type: "success", text: "Password changed successfully!" });
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            setPassMessage({ type: "error", text: error.message || "Failed to change password." });
        } finally {
            setIsPassLoading(false);
        }
    };

    const [isDangerModalOpen, setIsDangerModalOpen] = useState(false);

    const handleDangerAction = async (action: "deactivate" | "delete", confirmText: string) => {
        try {
            const res = await deactivateOrDeleteAccount(user.id, action, currentUserId, confirmText);

            if (res.error) {
                toast.error(`Error: ${res.error}`);
                return;
            }

            toast.success(res.success);
            setIsDangerModalOpen(false);
            // await signOut({ callbackUrl: '/hris/login' }); 

            router.push("/admin/users")

        } catch (error: any) {
            toast.error("An unexpected error occurred.");
        }
    };



    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border-b border-gray-100 dark:border-zinc-800 pb-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-100 tracking-tight">Account Settings</h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Manage your account details and security preferences.</p>
            </div>

            <div className="space-y-6">
                {/* Account Details Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-zinc-100">Account Details</h2>
                            <p className="text-xs text-gray-500 dark:text-zinc-400">Update the username and account role.</p>
                        </div>
                        {!isEditingProfile && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (isEditingProfile) {
                                        setIsEditingProfile(false);
                                        setProfileData({ username: userData.username, role: userData.role });
                                    } else {
                                        setIsEditingProfile(true);
                                        setProfileMessage({ type: "", text: "" });
                                    }
                                }}
                                className="cursor-pointer p-2 inline-flex items-center justify-center text-gray-400 hover:text-[#1a6b36] dark:hover:text-green-500 hover:bg-[#1a6b36]/5 dark:hover:bg-green-500/10 rounded-lg transition-colors"
                            >
                                {isEditingProfile ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                )}
                            </button>
                        )}

                    </div>

                    <div className="p-6">
                        {profileMessage.text && (
                            <div className={`p-3 mb-6 text-sm rounded-lg border ${profileMessage.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50'}`}>
                                {profileMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase mb-2">Username</label>
                                {!isEditingProfile ? (
                                    <div className="w-full md:w-1/2 p-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm text-gray-700 dark:text-zinc-400 shadow-sm cursor-not-allowed">
                                        {userData.username || "No username set."}
                                    </div>
                                ) : (
                                    <input type="text" value={profileData.username} onChange={(e) => setProfileData({ ...profileData, username: e.target.value })} className="w-full md:w-1/2 p-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all shadow-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:ring-1 focus:ring-[#1a6b36] dark:focus:ring-green-600 focus:border-[#1a6b36] dark:focus:border-green-600" />
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase mb-2">Role</label>
                                {!isEditingProfile ? (
                                    <div className="w-full md:w-1/2 p-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm text-gray-700 dark:text-zinc-400 shadow-sm cursor-not-allowed capitalize">
                                        {userData.role || "No role assigned."}
                                    </div>
                                ) : canEditRole ? (
                                    <select value={profileData.role} onChange={(e) => setProfileData({ ...profileData, role: e.target.value })} className="w-full md:w-1/2 p-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all shadow-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:ring-1 focus:ring-[#1a6b36] dark:focus:ring-green-600 focus:border-[#1a6b36] dark:focus:border-green-600 capitalize">
                                        <option value="user">User</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                ) : (
                                    <div>
                                        <div className="w-full md:w-1/2 p-2.5 bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm text-gray-500 dark:text-zinc-500 shadow-sm cursor-not-allowed capitalize">
                                            {userData.role}
                                        </div>
                                        {isCurrentUserAdmin && isEditingSelf ? (
                                            <p className="text-xs text-orange-600 dark:text-orange-500 mt-1.5 font-medium">You cannot change your own role.</p>
                                        ) : (
                                            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1.5 font-medium">Only administrators can modify roles.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            {currentUserRole === "admin" && canEditRole && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase mb-2">Deactivation or Deletion</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsDangerModalOpen(true)}
                                        className="w-full md:w-1/2 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg text-sm text-red-700 dark:text-red-400 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
                                    >
                                        Deactivate or Delete Account
                                    </button>
                                </div>
                            )}

                            {isEditingProfile && (
                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditingProfile(false);
                                            setProfileData({ username: userData.username, role: userData.role });
                                        }}
                                        className="cursor-pointer px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg transition-all"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isProfileLoading || (profileData.username === userData.username && profileData.role === userData.role)}
                                        className="cursor-pointer bg-[#1a6b36] dark:bg-green-700 hover:bg-[#155a2b] dark:hover:bg-green-600 text-white font-medium text-sm px-8 py-2.5 rounded-lg shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#1a6b36] focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                    >
                                        {isProfileLoading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Email Address Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-zinc-100">Email Address</h2>
                            <p className="text-xs text-gray-500 dark:text-zinc-400">Your email address is used for account notifications and login.</p>
                        </div>
                        {!isEditingEmail && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (isEditingEmail) {
                                        setIsEditingEmail(false);
                                        setEmail(userData.email);
                                    } else {
                                        setIsEditingEmail(true);
                                        setEmailMessage({ type: "", text: "" });
                                    }
                                }}
                                className="cursor-pointer p-2 inline-flex items-center justify-center text-gray-400 hover:text-[#1a6b36] dark:hover:text-green-500 hover:bg-[#1a6b36]/5 dark:hover:bg-green-500/10 rounded-lg transition-colors"
                                title={isEditingEmail ? "Cancel Editing" : "Edit Email"}
                            >
                                {isEditingEmail ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>
                    <div className="p-6">
                        {emailMessage.text && (
                            <div className={`p-3 mb-6 text-sm rounded-lg border ${emailMessage.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50'}`}>
                                {emailMessage.text}
                            </div>
                        )}
                        <form onSubmit={handleEmailUpdate} className="space-y-4">
                            <div>
                                {!isEditingEmail ? (
                                    <div className="w-full md:w-1/2 p-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm text-gray-700 dark:text-zinc-400 shadow-sm cursor-not-allowed">
                                        {userData.email || "No email address provided."}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3 w-full md:w-1/2">

                                        <input type="email" value={email || ""} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all shadow-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:ring-1 focus:ring-[#1a6b36] dark:focus:ring-green-600 focus:border-[#1a6b36] dark:focus:border-green-600" />

                                    </div>
                                )}
                                {isEditingEmail && (
                                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditingEmail(false);
                                                setEmail(userData.email);
                                            }}
                                            className="cursor-pointer px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg transition-all"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={isEmailLoading || email === userData.email || !email}
                                            className="cursor-pointer bg-[#1a6b36] dark:bg-green-700 hover:bg-[#155a2b] dark:hover:bg-green-600 text-white font-medium text-sm px-8 py-2.5 rounded-lg shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#1a6b36] focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                        >
                                            {isEmailLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Password Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-zinc-100">Password</h2>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">Update your password to ensure account security.</p>
                    </div>
                    <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
                        {passMessage.text && (
                            <div className={`p-3 text-sm rounded-lg border ${passMessage.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50'}`}>
                                {passMessage.text}
                            </div>
                        )}
                        <div className="space-y-4 md:w-1/2">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase mb-2">Current Password</label>
                                <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required className="w-full p-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all shadow-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:ring-1 focus:ring-[#1a6b36] dark:focus:ring-green-600 focus:border-[#1a6b36] dark:focus:border-green-600" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase mb-2">New Password</label>
                                <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength={8} className="w-full p-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all shadow-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:ring-1 focus:ring-[#1a6b36] dark:focus:ring-green-600 focus:border-[#1a6b36] dark:focus:border-green-600" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase mb-2">Confirm New Password</label>
                                <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required minLength={8} className="w-full p-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all shadow-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:ring-1 focus:ring-[#1a6b36] dark:focus:ring-green-600 focus:border-[#1a6b36] dark:focus:border-green-600" />
                            </div>
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={isPassLoading || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword} className="bg-[#1a6b36] dark:bg-green-700 text-white text-sm font-medium px-6 py-2 rounded-lg shadow-sm hover:bg-[#155a2b] dark:hover:bg-green-600 transition-all disabled:opacity-50">
                                {isPassLoading ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <AccountDangerModal
                isOpen={isDangerModalOpen}
                onClose={() => setIsDangerModalOpen(false)}
                onConfirm={handleDangerAction}
                targetUsername={userData.username}
            />
        </div>
    );
}