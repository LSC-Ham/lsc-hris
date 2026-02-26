"use client";

import { changePassword, updateEmail, updateUsername, updateRole } from "@/actions/employees/users/action";
import { useState, useEffect } from "react";

interface UserProps {
    user: any;
    currentUserId: string;   // The ID of the logged-in user
    currentUserRole: string; // The Role of the logged-in user
}

const DEFAULT_USER_DATA = {
    id: "", profile_picture: "", email: "", username: "", role: "user"
}

export default function AccountSettingsPage({ user, currentUserId, currentUserRole }: UserProps) {
    const [userData, setUserData] = useState({ ...DEFAULT_USER_DATA, ...(user || {}) });

    // --- PERMISSION LOGIC ---
    const isEditingSelf = userData.id === currentUserId;
    const isCurrentUserAdmin = currentUserRole === "admin";
    // They can edit the role IF they are an admin AND they are not editing themselves
    const canEditRole = isCurrentUserAdmin && !isEditingSelf;

    // --- COMBINED STATE: Profile (Username & Role) ---
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        username: userData.username || "",
        role: userData.role || "user"
    });
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

    // --- State for Email Form ---
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [email, setEmail] = useState(userData.email || "");
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [emailMessage, setEmailMessage] = useState({ type: "", text: "" });

    // --- State for Password Form ---
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

    // --- HANDLERS ---
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProfileLoading(true);
        setProfileMessage({ type: "", text: "" });

        try {
            // 1. Update Username if changed
            if (profileData.username !== userData.username) {
                const userRes = await updateUsername(user.id, profileData.username);
                if (userRes?.error) throw new Error(userRes.error);
            }

            // 2. Update Role if changed AND the user actually has permission
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

    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* PAGE HEADER */}
            <div className="border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Account Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account details and security preferences.</p>
            </div>

            <div className="space-y-6">

                {/* COMBINED PROFILE SECTION (Username + Role) */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Profile Details</h2>
                            <p className="text-xs text-gray-500">Update the username and account role.</p>
                        </div>
                        {!isEditingProfile && (
                            <button onClick={() => { setIsEditingProfile(true); setProfileMessage({ type: "", text: "" }); }} className="text-sm font-medium text-[#1a6b36] hover:underline">
                                Edit Details
                            </button>
                        )}
                    </div>

                    <div className="p-6">
                        {profileMessage.text && (
                            <div className={`p-3 mb-6 text-sm rounded-lg ${profileMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {profileMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            {/* USERNAME FIELD */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Username</label>
                                {!isEditingProfile ? (
                                    <div className="w-full md:w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 shadow-sm cursor-not-allowed">
                                        {userData.username || "No username set."}
                                    </div>
                                ) : (
                                    <input type="text" value={profileData.username} onChange={(e) => setProfileData({ ...profileData, username: e.target.value })} className="w-full md:w-1/2 p-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all shadow-sm bg-white focus:ring-1 focus:border-green-500" />
                                )}
                            </div>

                            {/* ROLE FIELD */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Role</label>
                                {!isEditingProfile ? (
                                    <div className="w-full md:w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 shadow-sm cursor-not-allowed capitalize">
                                        {userData.role || "No role assigned."}
                                    </div>
                                ) : canEditRole ? (
                                    /* ADMIN EDITING SOMEONE ELSE: Show dropdown */
                                    <select value={profileData.role} onChange={(e) => setProfileData({ ...profileData, role: e.target.value })} className="w-full md:w-1/2 p-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all shadow-sm bg-white focus:ring-1 focus:border-green-500 capitalize">
                                        <option value="user">User</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                ) : (
                                    /* LOCKED VIEW: Show grayed out box with specific reason */
                                    <div>
                                        <div className="w-full md:w-1/2 p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 shadow-sm cursor-not-allowed capitalize">
                                            {userData.role}
                                        </div>
                                        {isCurrentUserAdmin && isEditingSelf ? (
                                            <p className="text-xs text-orange-600 mt-1.5 font-medium">You cannot change your own role.</p>
                                        ) : (
                                            <p className="text-xs text-gray-500 mt-1.5 font-medium">Only administrators can modify roles.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {isEditingProfile && (
                                <div className="flex gap-2 pt-2 md:w-1/2">
                                    <button type="submit" disabled={isProfileLoading || (profileData.username === userData.username && profileData.role === userData.role)} className="flex-1 bg-[#1a6b36] text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all disabled:opacity-50">
                                        {isProfileLoading ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button type="button" onClick={() => { setIsEditingProfile(false); setProfileData({ username: userData.username, role: userData.role }); }} className="flex-1 bg-white text-gray-600 border border-gray-300 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm hover:bg-gray-50 transition-all">
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* EMAIL SECTION */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* ... (Unchanged) ... */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Email Address</h2>
                            <p className="text-xs text-gray-500">Your email address is used for account notifications and login.</p>
                        </div>
                        {!isEditingEmail && (
                            <button onClick={() => { setIsEditingEmail(true); setEmailMessage({ type: "", text: "" }); }} className="text-sm font-medium text-[#1a6b36] hover:underline">
                                Edit
                            </button>
                        )}
                    </div>
                    <div className="p-6">
                        {emailMessage.text && (
                            <div className={`p-3 mb-6 text-sm rounded-lg ${emailMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {emailMessage.text}
                            </div>
                        )}
                        <form onSubmit={handleEmailUpdate} className="space-y-4">
                            <div>
                                {!isEditingEmail ? (
                                    <div className="w-full md:w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 shadow-sm cursor-not-allowed">
                                        {userData.email || "No email address provided."}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3 w-full md:w-1/2">
                                        <input type="email" value={email || ""} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all shadow-sm bg-white focus:ring-1 focus:border-green-500" />
                                        <div className="flex gap-2">
                                            <button type="submit" disabled={isEmailLoading || email === userData.email || !email} className="flex-1 bg-[#1a6b36] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all disabled:opacity-50">Save</button>
                                            <button type="button" onClick={() => { setIsEditingEmail(false); setEmail(userData.email); }} className="flex-1 bg-white text-gray-600 border border-gray-300 text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-all">Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* PASSWORD SECTION */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* ... (Unchanged) ... */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-lg font-semibold text-gray-800">Password</h2>
                        <p className="text-xs text-gray-500">Update your password to ensure account security.</p>
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
                                <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all shadow-sm bg-white focus:ring-1 focus:border-green-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">New Password</label>
                                <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength={8} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all shadow-sm bg-white focus:ring-1 focus:border-green-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Confirm New Password</label>
                                <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required minLength={8} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-all shadow-sm bg-white focus:ring-1 focus:border-green-500" />
                            </div>
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={isPassLoading || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword} className="bg-[#1a6b36] text-white text-sm font-medium px-6 py-2 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all disabled:opacity-50">
                                {isPassLoading ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}