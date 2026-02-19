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
        const formattedGovIds = employee.government_ids.map((record) => ({
            id: record.id,
            id_label: record.id_label,
            id_number: record.id_number,
        }));

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
            govt_ids: formattedGovIds,
        };

    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function getAddress() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const userId = (session.user as any).id;

        const employee = await prisma.employees.findUnique({
            where: { id: userId },
            include: {
                address: true,
            },
        });

        if (!employee) return null;

        const formattedAddress = employee.address.map((record) => ({
            id: record.id,
            address_type: record.address_type,
            region: record.region,
            province: record.province,
            city: record.city,
            barangay: record.barangay,
            house_no: record.house_no,
            street: record.street,
            subdivision: record.subdivision,
            zip_code: record.zip_code,
        }));
        return {
            id: employee.id,
            address: formattedAddress,
        };

    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function getFamilyBackground() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const userId = (session.user as any).id;

        const employee = await prisma.employees.findUnique({
            where: { id: userId },
            include: {
                family_background: true,
            },
        });

        if (!employee) return null;

        const formattedFam_bg = employee.family_background.map((record) => ({
            id: record.id,
            relation_type: record.relation_type,
            surname: record.surname,
            firstname: record.firstname,
            middlename: record.middlename,
            extension: record.extension,
            occupation: record.occupation,
            employer: record.employer,
            occupation_address: record.occupation_address,
            contact_no: record.contact_no,

        }));
        return {
            id: employee.id,
            family_background: formattedFam_bg,
        };

    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function getEducationalBackground() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const userId = (session.user as any).id;

        // Directly query the "Many" table using the employee's ID
        const educationRecords = await prisma.educational_background.findMany({
            where: {
                employees_id: userId
            },
            orderBy: {
                date_from: 'desc' // Optional: Brings their most recent education to the top
            }
        });

        // Map the array of records to safely format the dates and nulls for your frontend state
        const formattedEducation = educationRecords.map((edu: any) => ({
            id: edu.id,
            level: edu.level || "",
            school: edu.school || "",
            degree: edu.degree || "",
            // Format DateTime to "YYYY-MM-DD" string for your <input type="date" />
            date_from: edu.date_from ? edu.date_from.toISOString().split('T')[0] : "",
            date_to: edu.date_to ? edu.date_to.toISOString().split('T')[0] : "",
            units_earned: edu.units_earned || "",
            year_graduated: edu.year_graduated || "",
        }));

        return formattedEducation; // Returns an array []

    } catch (error) {
        console.error("Error fetching educational background:", error);
        return []; // Always return an array so your frontend .map() doesn't break
    }
}