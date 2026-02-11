"use server";

import { prisma } from "@/lib/prisma"; // Make sure this path matches your utils
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
    // 1. Extract data from the form
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    // 2. Simple Validation
    if (!username || !email || !password) {
        return { error: "Please fill in all required fields." };
    }

    // 3. Check for duplicates
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { username }],
        },
    });

    if (existingUser) {
        return { error: "User with this username or email already exists." };
    }

    try {
        // 4. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create the User
        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: role || "",
                password_changed: false,  // Force them to change it later
            },
        });

        revalidatePath("/users");

        return { success: "User account created successfully." };
    } catch (error) {
        console.error("Create User Error:", error);
        return { error: "Failed to create user. Please try again." };
    }
}