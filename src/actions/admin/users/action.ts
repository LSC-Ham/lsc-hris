"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt"; // Assuming you use bcrypt for passwords. Adjust if using something else!

export async function deactivateOrDeleteAccount(
    userId: string,
    action: "deactivate" | "delete",
    passwordStr: string
) {
    try {
        // 1. Fetch the user to verify they exist and get their hashed password
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return { error: "User not found." };
        }

        if (!user.password) {
            return { error: "This account doesn't have a password set up." };
        }

        // 2. Verify the provided password matches the database
        const isPasswordValid = await bcrypt.compare(passwordStr, user.password);

        if (!isPasswordValid) {
            return { error: "Incorrect password. Please try again." };
        }

        // 3. Perform the requested database action
        if (action === "deactivate") {
            await prisma.user.update({
                where: { id: userId },
                data: { is_active: false }
            });
            return { success: "Account successfully deactivated." };

        } else if (action === "delete") {
            // Note: If you get a Prisma error here, ensure your schema relations 
            // (accounts, sessions, biography) have `onDelete: Cascade` set up, 
            // or manually delete those related records first!
            await prisma.user.delete({
                where: { id: userId }
            });
            return { success: "Account successfully deleted." };
        }

        return { error: "Invalid action requested." };

    } catch (error: any) {
        console.error("Error in deactivateOrDeleteAccount:", error);
        return { error: error.message || "Something went wrong on the server." };
    }
}