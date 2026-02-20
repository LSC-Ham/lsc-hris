'use server';

import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

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
            // This assumes your DB path looks like "/uploads/filename.jpg"
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