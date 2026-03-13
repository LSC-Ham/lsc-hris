"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt"; 

export async function deactivateOrDeleteAccount(
    userId: string,
    action: "deactivate" | "delete",
    passwordStr: string
) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return { error: "User not found." };
        }

        if (!user.password) {
            return { error: "This account doesn't have a password set up." };
        }

        const isPasswordValid = await bcrypt.compare(passwordStr, user.password);

        if (!isPasswordValid) {
            return { error: "Incorrect password. Please try again." };
        }

        if (action === "deactivate") {
            await prisma.user.update({
                where: { id: userId },
                data: { is_active: false }
            });
            return { success: "Account successfully deactivated." };

        } else if (action === "delete") {
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