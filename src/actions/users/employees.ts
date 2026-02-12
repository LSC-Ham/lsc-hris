"use server";

import { prisma } from "@/lib/prisma"; // Adjust this import to your actual Prisma client location
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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

export async function getUserProfile() {
    try {
        // 1. Get the current user's ID from session
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/login");
        }

        const userId = (session.user as any).id;

        // 2. Fetch Employee + Personal Info + Employment Details
        const employee = await prisma.employees.findUnique({
            where: { id: userId },
            include: {
                personal_information: true,
                // Assuming you have a relation for positions/employment
                // employment_details: true, 
            },
        });

        if (!employee) return null;

        // 3. Flatten the data to match your frontend State
        // We merge employee table data AND personal_information table data
        return {
            // --- IDs ---
            id: employee.id,

            // --- Personal Info (Handling nulls with || "") ---
            surname: employee.personal_information?.surname || "",
            firstname: employee.personal_information?.firstname || "",
            middlename: employee.personal_information?.middlename || "",
            extension: employee.personal_information?.extension || "",
            birthdate: employee.personal_information?.birthdate || "",
            birthplace: employee.personal_information?.birthplace || "",
            sex: employee.personal_information?.sex || "",
            civil_status: employee.personal_information?.civil_status || "",
            telephone_no: employee.personal_information?.telephone_no || "",
            mobile_no: employee.personal_information?.mobile_no || "",
            email: employee.personal_information?.email || "",
            nationality: employee.personal_information?.nationality || "",
            height: employee.personal_information?.height || "",
            weight: employee.personal_information?.weight || "",
            blood_type: employee.personal_information?.blood_type || "",
        };

    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}