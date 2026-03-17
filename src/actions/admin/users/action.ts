"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function deactivateOrDeleteAccount(
    targetUserId: string,
    action: "deactivate" | "delete",
    adminId: string,
    confirmText: string // The typed username from the modal
) {
    try {
        // 1. Fetch the Admin making the request
        const adminUser = await prisma.user.findUnique({
            where: { id: adminId }
        });

        // 2. Security Check: Are they actually an admin?
        if (!adminUser || adminUser.role !== "admin") {
            return { error: "Unauthorized. Only admins can perform this action." };
        }

        // 3. Fetch the target user
        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId }
        });

        if (!targetUser) {
            return { error: "The employee you are trying to modify was not found." };
        }

        // 4. Defense-in-depth: Verify the typed text matches the target's username
        if (confirmText !== targetUser.username) {
            return { error: "Confirmation text did not match the username." };
        }

        // Prevent Admins from deleting themselves via this route
        if (adminId === targetUserId) {
            return { error: "You cannot deactivate or delete your own account from this view." };
        }

        // 5. Execute Danger Action
        if (action === "deactivate") {
            await prisma.user.update({
                where: { id: targetUserId },
                data: { is_active: false }
            });
            return { success: "Account successfully deactivated." };

        } else if (action === "delete") {
            await prisma.user.delete({
                where: { id: targetUserId }
            });
            return { success: "Account successfully deleted." };
        }

        return { error: "Invalid action requested." };

    } catch (error: any) {
        console.error("Error in deactivateOrDeleteAccount:", error);
        return { error: error.message || "Something went wrong on the server." };
    }
}