"use server";

import { prisma } from "@/lib/prisma"; // Adjust this import to your actual Prisma client location
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt"; // Requires: npm install bcryptjs\

export async function getUsers(userId: string) {
    if (!userId || userId === "") {
        console.warn("getUsers called with an empty userId");
        return null; // Return null so your UI can handle the missing user gracefully
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
        // 1. Check if username is already taken by another user
        const existingUser = await prisma.user.findUnique({ where: { username: newUsername } });
        if (existingUser && existingUser.id !== userId) {
            return { error: "This username is already in use by another account." };
        }

        // 2. Update the user
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
        // 1. Check if role is valid (you can define allowed roles in your app)
        const allowedRoles = ["user", "admin", "manager"];
        if (!allowedRoles.includes(newRole)) {
            return { error: "Invalid role." };
        }

        // 2. Update the user's role
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
        // 1. Check if email is already taken by another user
        const existingUser = await prisma.user.findUnique({ where: { email: newEmail } });
        if (existingUser && existingUser.id !== userId) {
            return { error: "This email is already in use by another account." };
        }

        // 2. Update the user
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
        // 1. Fetch user to get their current hashed password
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.password) return { error: "User not found or password not set." };

        // 2. Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return { error: "The current password you entered is incorrect." };
        }

        // 3. Hash the new password and update
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedNewPassword,
                password_changed: true // Updating your schema boolean!
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Change Password Error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function deleteProfilePicture(userId: string) {
    if (!userId) throw new Error('User ID is required');

    try {
        // 1. Get the current user to find the file path
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { profile_picture: true }
        });

        // 2. If they have a picture, delete it from the filesystem
        if (user?.profile_picture) {
            // This assumes your DB path looks like "/avatar/filename.jpg"
            const filepath = path.join(process.cwd(), 'public', user.profile_picture);

            try {
                await fs.unlink(filepath);
            } catch (fsError) {
                // We catch this in case the file was already deleted manually
                console.warn("File already deleted or not found on disk:", fsError);
            }
        }

        // 3. Update the database to remove the image path
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
        // 1. ✨ NEW: Check if the user already has a picture and delete the old file
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
                // Ignore errors if the file was already missing
                console.warn("Could not delete old file (it may not exist):", err);
            }
        }

        // 2. Save the NEW file to the filesystem
        const buffer = Buffer.from(await file.arrayBuffer());
        // Create a unique filename so browsers don't cache the old image
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `profile-${userId}-${uniqueSuffix}.jpg`;

        // Ensure your uploads directory exists
        const uploadDir = path.join(process.cwd(), 'public/avatar');
        await fs.mkdir(uploadDir, { recursive: true });

        const newFilePath = path.join(uploadDir, filename);
        await fs.writeFile(newFilePath, buffer);

        // 3. Update the database with the new path
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