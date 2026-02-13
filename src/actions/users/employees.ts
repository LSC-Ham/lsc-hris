"use server";

import { prisma } from "@/lib/prisma"; // Adjust this import to your actual Prisma client location
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function generateEmployeeID() {
    try {
        const count = await prisma.employees.count();

        const nextId = count + 1;

        return nextId.toString().padStart(4, '0');
    } catch (error) {
        console.error("Error generating ID:", error);
        return "";
    }
}

export async function getPersonalInformation() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/login");
        }

        const userId = (session.user as any).id;

        const employee = await prisma.employees.findUnique({
            where: { id: userId },
            include: {
                personal_information: true,
            },
        });

        if (!employee) return null;

        return {
            id: employee.id,
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

export async function getEmployeeDetails() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const userId = (session.user as any).id;

        const employee = await prisma.employees.findUnique({
            where: { id: userId },
            include: {
                // 1. Fetch the pivot table (employees_positions)
                positions: {
                    include: {
                        positions: true
                    },
                    orderBy: {
                        start_at: 'desc'
                    }
                },
                government_ids: true,
                divisions: true,
                departments: true
            }
        });

        if (!employee) return null;

        // 3. Map the data to a clean structure for the frontend
        const formattedPositions = employee.positions.map((record) => ({
            id: record.id,                       // ID of the assignment
            position_id: record.positions.id,    // ID of the position definition
            position: record.positions.position, // THE NAME (e.g., "Software Engineer")
            status: record.status,               // e.g., "Active", "Probationary"
            description: record.description,
            start_at: record.start_at,
            end_at: record.end_at,
        }));

        return {
            id_number: employee.id_number,
            division: employee.divisions?.division, // or employee.divisions.name
            department: employee.departments?.department,
            positions: formattedPositions, // Return the formatted array
            govt_ids: employee.government_ids,
        };

    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}