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
            // This grabs every property inside personal_information and attaches it 
            // to the return object. If it's null, it just returns an empty object.
            ...(employee.personal_information || {}),
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

        const employee = await prisma.employees.findUnique({
            where: { id: (session.user as any).id },
            include: {
                positions: { include: { positions: true }, orderBy: { start_at: 'desc' } },
                government_ids: true,
                divisions: true,
                departments: true
            }
        });

        if (!employee) return null;

        // 1. Map standard government ID labels to your frontend snake_case keys
        const govIdKeys: Record<string, string> = {
            "GSIS No.": "gsis_no", "Pag-IBIG No.": "pagibig_no",
            "PhilHealth No.": "philhealth_no", "SSS No.": "sss_no",
            "TIN No.": "tin_no", "Agency No.": "agency_no"
        };

        // 2. Transform the array of IDs into a flat object (e.g., { gsis_no: "123", tin_no: "456" })
        const flatGovIds = employee.government_ids.reduce((acc: any, curr) => {
            const key = govIdKeys[curr.id_label];
            if (key) acc[key] = curr.id_number;
            return acc;
        }, {});

        return {
            id_number: employee.id_number,
            remarks: employee.remarks,
            hired_at: employee.hired_at,
            division: employee.divisions?.division || "",
            department: employee.departments?.department || "",
            govt_ids: employee.government_ids,
            ...flatGovIds, // <--- Spreads gsis_no, tin_no, etc., directly into the return object!

            // 3. Flatten the positions array using the spread operator
            positions: employee.positions.map(({ positions, ...record }) => ({
                ...record, // Grabs status, description, start_at, end_at, etc.
                position_id: positions.id,
                position: positions.position,
            })),
        };

    } catch (error) {
        console.error("Error fetching employment details:", error);
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

export async function getEligibility() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const userId = (session.user as any).id;

        // Directly query the "Many" table using the employee's ID
        const eligibilityRecords = await prisma.eligibility.findMany({
            where: {
                employees_id: userId
            },
        });

        // Map the array of records to safely format the dates and nulls for your frontend state
        const formattedEligibility = eligibilityRecords.map((eli: any) => ({
            id: eli.id,
            qualification: eli.qualification || "",
            rating: eli.rating || "",
            // Format DateTime to "YYYY-MM-DD" string for your <input type="date" />
            date_examination: eli.date_examination ? eli.date_examination.toISOString().split('T')[0] : "",
            place_examination: eli.place_examination || "",
            id_number: eli.id_number || "",
            date_validity: eli.date_validity || "",
        }));

        return formattedEligibility; // Returns an array []

    } catch (error) {
        console.error("Error fetching educational background:", error);
        return []; // Always return an array so your frontend .map() doesn't break
    }
}

export async function getWorkExperience() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const userId = (session.user as any).id;

        // Query the work_experience table directly
        const workRecords = await prisma.work_experience.findMany({
            where: {
                employees_id: userId
            },
            orderBy: {
                date_from: 'desc' // ISO standard: show most recent experience first
            }
        });

        // Map and format for frontend state
        const formattedWorkExperience = workRecords.map((work: any) => ({
            id: work.id,
            position_title: work.position_title || "",
            company: work.company || "",
            // Convert Decimal to Number for frontend state
            monthly_salary: work.monthly_salary ? Number(work.monthly_salary) : 0,
            appointment_status: work.appointment_status || "",
            gov_service: work.gov_service || false,
            // Format DateTime to "YYYY-MM-DD" for <input type="date" />
            date_from: work.date_from ? work.date_from.toISOString().split('T')[0] : "",
            date_to: work.date_to ? work.date_to.toISOString().split('T')[0] : "",
        }));

        return formattedWorkExperience;

    } catch (error) {
        console.error("Error fetching work experience:", error);
        return []; // Return empty array to prevent frontend .map() crashes
    }
}

export async function getUsers() {
    try {

        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const userId = (session.user as any).id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, profile_picture: true,
            }
        });

        if (!user) return null

        return {
            id: user.id,
            profile_picture: user.profile_picture,
        };

    } catch (error) {
        console.error("Failed to fetch profile picture:", error);
        return null;
    }
}



