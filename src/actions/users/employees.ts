"use server";

import { prisma } from "@/lib/prisma"; // Adjust this import to your actual Prisma client location

export async function generateNextEmployeeId() {
    try {
        // 1. Get the total count (length) of the table
        const count = await prisma.employees.count();

        // 2. Add 1 to the count
        const nextId = count + 1;

        // 3. Convert to string (since your schema says id_number is String)
        // Optional: Add .padStart(4, '0') if you want it to look like "0005" instead of just "5"
        return nextId.toString().padStart(4, '0');
    } catch (error) {
        console.error("Error generating ID:", error);
        return ""; // Return empty string on failure so user can type manually
    }
}