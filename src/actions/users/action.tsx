"use server";

import { prisma } from "@/lib/prisma";
import fs from 'fs/promises';
import path from 'path';
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUsers(userId: string) {
    if (!userId || userId === "") {
        console.warn("getUsers called with an empty userId");
        return null;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, profile_picture: true, email: true, role: true, username: true,
            }
        });

        if (!user) return null

        return {
            id: user.id,
            profile_picture: user.profile_picture,
            email: user.email,
            role: user.role,
            username: user.username,
        };

    } catch (error) {
        console.error("Failed to fetch profile picture:", error);
        return null;
    }
}

export async function updateUsername(userId: string, newUsername: string) {

    try {
        const existingUser = await prisma.user.findUnique({ where: { username: newUsername } });
        if (existingUser && existingUser.id !== userId) {
            return { error: "This username is already in use by another account." };
        }

        await prisma.user.update({
            where: { id: userId },
            data: { username: newUsername },
        });

        return { success: true };
    } catch (error) {
        console.error("Update Username Error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function updateRole(userId: string, newRole: string) {

    try {
        const allowedRoles = ["user", "admin", "manager"];
        if (!allowedRoles.includes(newRole)) {
            return { error: "Invalid role." };
        }

        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        });

        return { success: true };
    } catch (error) {
        console.error("Update Role Error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function updateEmail(userId: string, newEmail: string) {

    try {
        const existingUser = await prisma.user.findUnique({ where: { email: newEmail } });
        if (existingUser && existingUser.id !== userId) {
            return { error: "This email is already in use by another account." };
        }

        await prisma.user.update({
            where: { id: userId },
            data: { email: newEmail },
        });

        return { success: true };
    } catch (error) {
        console.error("Update Email Error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.password) return { error: "User not found or password not set." };

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return { error: "The current password you entered is incorrect." };
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedNewPassword,
                password_changed: true
            },
        });

        revalidatePath("/hris");

        return { success: true };
    } catch (error) {
        console.error("Change Password Error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function setupFirstPassword(newPassword: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        const userId = (session.user as any).id;

        if (!newPassword || newPassword.length < 8) {
            return { error: "Password must be at least 8 characters long." };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                password_changed: true, // This unlocks their account!
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Setup password error:", error);
        return { error: "Failed to update password. Please try again." };
    }
}

export async function deleteProfilePicture(userId: string) {
    if (!userId) throw new Error('User ID is required');

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { profile_picture: true }
        });

        if (user?.profile_picture) {
            const filepath = path.join(process.cwd(), 'public', user.profile_picture);

            try {
                await fs.unlink(filepath);
            } catch (fsError) {
                console.warn("File already deleted or not found on disk:", fsError);
            }
        }

        await prisma.user.update({
            where: { id: userId },
            data: { profile_picture: null }
        });

        return { success: true };
    } catch (error) {
        console.error("Error deleting profile picture:", error);
        return { success: false, error: "Failed to delete profile picture" };
    }
}

export async function uploadProfilePicture(formData: FormData) {
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
        return { success: false, error: 'File and User ID are required' };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { profile_picture: true }
        });

        if (existingUser?.profile_picture) {
            const oldFilePath = path.join(process.cwd(), 'public', existingUser.profile_picture);
            try {
                await fs.unlink(oldFilePath);
                console.log("Old profile picture deleted successfully.");
            } catch (err) {
                console.warn("Could not delete old file (it may not exist):", err);
            }
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `profile-${userId}-${uniqueSuffix}.jpg`;

        const uploadDir = path.join(process.cwd(), 'public/avatar');
        await fs.mkdir(uploadDir, { recursive: true });

        const newFilePath = path.join(uploadDir, filename);
        await fs.writeFile(newFilePath, buffer);

        const dbImagePath = `/avatar/${filename}`;
        await prisma.user.update({
            where: { id: userId },
            data: { profile_picture: dbImagePath }
        });

        return { success: true, imagePath: dbImagePath };

    } catch (error) {
        console.error("Upload Error:", error);
        return { success: false, error: 'Failed to upload profile picture' };
    }
}