"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'avatars';
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

        revalidatePath("/hris/dashboard");

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
                password_changed: true,
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
        // 1. Get the current filename
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { profile_picture: true }
        });

        // 2. Delete from Supabase Storage
        if (user?.profile_picture) {
            const fileName = user.profile_picture.replace('/avatar/', '');

            const { error: removeError } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([fileName]);

            if (removeError) {
                console.warn("Could not delete file from Supabase:", removeError.message);
            }
        }

        // 3. Clear the database record
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
        // 1. Check for an existing profile picture
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { profile_picture: true }
        });

        // 2. Delete the old picture from Supabase if it exists
        if (existingUser?.profile_picture) {
            // .replace is added here as a safety measure for your old local file paths
            // It ensures if the DB still has "/avatar/filename.jpg", it extracts just "filename.jpg"
            const oldFileName = existingUser.profile_picture.replace('/avatar/', '');

            const { error: removeError } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([oldFileName]);

            if (removeError) {
                console.warn("Could not delete old file from Supabase:", removeError.message);
            }
        }

        // 3. Prepare the new file
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `profile-${userId}-${uniqueSuffix}.jpg`;

        // 4. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filename, file, {
                contentType: file.type || 'image/jpeg',
                upsert: true,
                cacheControl: '3600'
            });

        if (uploadError) {
            throw new Error(`Supabase Upload Error: ${uploadError.message}`);
        }

        // 5. Update Database with ONLY the filename
        await prisma.user.update({
            where: { id: userId },
            data: { profile_picture: filename } // Storing just the filename works perfectly with our frontend setup
        });

        return { success: true, imagePath: filename };

    } catch (error) {
        console.error("Upload Error:", error);
        return { success: false, error: 'Failed to upload profile picture' };
    }
}