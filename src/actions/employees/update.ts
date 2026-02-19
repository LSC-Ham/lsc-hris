"use server";

import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma"; // Adjust this import to your actual Prisma client location
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import { revalidatePath } from "next/cache";
import { Prisma } from "../../../generated/prisma/client";

export async function updatePersonalInformation(data: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return { success: false, error: "Unauthorized. Please log in." };
        }

        const userId = (session.user as any).id;
        const { id, ...updateData } = data;

        // --- THE FIX: Format the birthdate ---
        // If there's a date, convert it to a true Date object. If it's "", make it null or undefined.
        // (Note: use `undefined` instead of `null` if your Prisma schema marks birthdate as required).
        const validBirthdate = updateData.birthdate
            ? new Date(updateData.birthdate).toISOString()
            : null;

        await prisma.employees.update({
            where: {
                id: userId
            },
            data: {
                personal_information: {
                    upsert: {
                        create: {
                            surname: updateData.surname,
                            firstname: updateData.firstname,
                            middlename: updateData.middlename,
                            extension: updateData.extension,
                            birthdate: validBirthdate, // <-- Pass the formatted date here
                            birthplace: updateData.birthplace,
                            sex: updateData.sex,
                            civil_status: updateData.civil_status,
                            telephone_no: updateData.telephone_no,
                            mobile_no: updateData.mobile_no,
                            email: updateData.email,
                            nationality: updateData.nationality,
                            height: updateData.height,
                            weight: updateData.weight,
                            blood_type: updateData.blood_type,
                        },
                        update: {
                            surname: updateData.surname,
                            firstname: updateData.firstname,
                            middlename: updateData.middlename,
                            extension: updateData.extension,
                            birthdate: validBirthdate, // <-- And pass it here
                            birthplace: updateData.birthplace,
                            sex: updateData.sex,
                            civil_status: updateData.civil_status,
                            telephone_no: updateData.telephone_no,
                            mobile_no: updateData.mobile_no,
                            email: updateData.email,
                            nationality: updateData.nationality,
                            height: updateData.height,
                            weight: updateData.weight,
                            blood_type: updateData.blood_type,
                        }
                    }
                }
            }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        console.error("Error updating personal information:", error);
        return { success: false, error: "Failed to save changes to the database." };
    }
}

export async function updateAddress(data: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return { success: false, error: "Unauthorized. Please log in." };
        }

        const userId = (session.user as any).id;

        // data looks like: { residential: {...}, permanent: {...} }
        await prisma.employees.update({
            where: {
                id: userId
            },
            data: {
                // Access the related address table
                address: {
                    // 1. Remove the old addresses of these specific types
                    deleteMany: {
                        address_type: {
                            in: ["residential", "permanent"]
                        }
                    },
                    // 2. Insert the newly updated ones
                    create: [
                        {
                            address_type: "residential",
                            region: data.residential.region,
                            province: data.residential.province,
                            city: data.residential.city,
                            barangay: data.residential.barangay,
                            house_no: data.residential.house_no,
                            street: data.residential.street,
                            subdivision: data.residential.subdivision,
                            zip_code: data.residential.zip_code,
                        },
                        {
                            address_type: "permanent",
                            region: data.permanent.region,
                            province: data.permanent.province,
                            city: data.permanent.city,
                            barangay: data.permanent.barangay,
                            house_no: data.permanent.house_no,
                            street: data.permanent.street,
                            subdivision: data.permanent.subdivision,
                            zip_code: data.permanent.zip_code,
                        }
                    ]
                }
            }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        console.error("Error updating address information:", error);
        return { success: false, error: "Failed to save changes to the database." };
    }
}

export async function updateFamilyBackground(data: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return { success: false, error: "Unauthorized. Please log in." };
        }

        const userId = (session.user as any).id;

        await prisma.employees.update({
            where: {
                id: userId
            },
            data: {
                // Access your family background relation (adjust 'family_background' to match your schema)
                family_background: {
                    // 1. Clear out the existing family records for these specific relationships
                    deleteMany: {
                        relation_type: {
                            in: ["guardian", "father", "mother"]
                        }
                    },
                    // 2. Insert the updated records
                    create: [
                        { relation_type: "guardian", ...data.guardian },
                        { relation_type: "father", ...data.father },
                        { relation_type: "mother", ...data.mother }
                    ]
                }
            }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        console.error("Error updating family information:", error);
        return { success: false, error: "Failed to save changes to the database." };
    }
}

export async function updateEducationalBackground(data: any[]) { // Expecting an array of records
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return { success: false, error: "Unauthorized. Please log in." };
        }

        const userId = (session.user as any).id;

        await prisma.employees.update({
            where: {
                id: userId
            },
            data: {
                // This is the magic nested write block
                educational_background: {
                    // 1. Clear out the old records associated with this employee
                    deleteMany: {},

                    // 2. Insert the updated array of records
                    create: data.map((record: any) => ({
                        level: record.level || null,
                        school: record.school || null,
                        degree: record.degree || null,
                        // Convert frontend string dates ("YYYY-MM-DD") to JS Date objects for PostgreSQL DateTime
                        date_from: record.date_from ? new Date(record.date_from) : null,
                        date_to: record.date_to ? new Date(record.date_to) : null,
                        units_earned: record.units_earned || null,
                        year_graduated: record.year_graduated || null,
                    }))
                }
            }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        console.error("Error updating educational background:", error);
        return { success: false, error: "Failed to save changes to the database." };
    }
}

export async function updateEligibility(data: any[]) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return { success: false, error: "Unauthorized. Please log in." };
        }

        const userId = (session.user as any).id;

        await prisma.employees.update({
            where: {
                id: userId
            },
            data: {
                // Nested write for the eligibility relation
                eligibility: {
                    // 1. Wipe existing eligibility records for this employee
                    deleteMany: {},

                    // 2. Create the new records from the array
                    create: data.map((record: any) => ({
                        qualification: record.qualification || null,
                        rating: record.rating || null,
                        // Schema uses String? for these, so we pass them directly
                        date_examination: record.date_examination || null,
                        place_examination: record.place_examination || null,
                        id_number: record.id_number || null,
                        date_validity: record.date_validity || null,
                    }))
                }
            }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        console.error("Error updating eligibility:", error);
        return { success: false, error: "Failed to save eligibility records to the database." };
    }
}

export async function updateWorkExperience(data: any[]) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return { success: false, error: "Unauthorized. Please log in." };
        }

        const userId = (session.user as any).id;

        await prisma.employees.update({
            where: {
                id: userId
            },
            data: {
                work_experience: {
                    // 1. Wipe existing records to sync with the new list
                    deleteMany: {},

                    // 2. Create the new records
                    create: data.map((record: any) => ({
                        date_from: record.date_from ? new Date(record.date_from) : null,
                        date_to: record.date_to ? new Date(record.date_to) : null,
                        position_title: record.position_title || null,
                        company: record.company || null,

                        // Convert string/number to Prisma Decimal
                        monthly_salary: record.monthly_salary
                            ? new Prisma.Decimal(record.monthly_salary)
                            : null,

                        appointment_status: record.appointment_status || null,
                        gov_service: Boolean(record.gov_service),
                    }))
                }
            }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (error) {
        console.error("Error updating work experience:", error);
        return { success: false, error: "Failed to save work experience." };
    }
}