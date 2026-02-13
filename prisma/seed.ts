// prisma/seed.ts

import { PrismaClient } from "../generated/prisma/client"; // Ensure this path matches your setup
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg"; // You likely need this for the adapter
import bcrypt from "bcrypt";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;

// Set up the adapter (only if you are using Neon/Vercel Postgres, otherwise standard PrismaClient is fine)
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

export async function main() {
    // 1. Prepare the password hash once (or inside the loop)
    const hashedPassword = await bcrypt.hash("@lakeshore123", SALT_ROUNDS);

    // 2. Define your data. 
    // We combine User info and Employee info into one object for easier looping.
    const seeds = [
        {
            username: "",
            email: "hmarandang@lakeshore.edu.ph",
            password: hashedPassword,
            role: "admin",

            // employee details
            id_number: "ad03069",
            department: "Information Technology",
            hired_at: "",
            position: "IT Personnel",
            status: "Full-Time",
            start_at: new Date("1/22/2026"),
            division: "Admininistration",
            govt_id_label: "SSS No.",
            govt_id_number: "414141",
        },
    ];

    console.log(`Start seeding ...`);

    for (const data of seeds) {
        // 3. Use upsert: It creates if new, or updates if exists (prevents duplicates on re-runs)
        const department = await prisma.departments.upsert({
            where: { department: data.department },
            update: {}, // No updates if it already exists
            create: {
                department: data.department,
            },
        });
        console.log(`Created department with name: ${department.department}`);

        const position = await prisma.positions.upsert({
            where: { position: data.position },
            update: {}, // No updates if it already exists
            create: {
                position: data.position,
            },
        });
        console.log(`Created position with name: ${position.position}`);

        const division = await prisma.divisions.upsert({
            where: { division: data.division },
            update: {}, // No updates if it already exists
            create: {
                division: data.division,
            },
        });
        console.log(`Created division with name: ${division.division}`);

        const user = await prisma.user.upsert({
            where: { username: data.username },
            update: {}, // No updates if it already exists
            create: {
                username: data.username,
                email: data.email,
                password: data.password,
                role: data.role,
                // --- THIS IS THE FIX ---
                // We create the linked Employee record AT THE SAME TIME
                employees: {
                    create: {
                        id_number: data.id_number,
                        departments_id: department.id,
                        divisions_id: division.id,
                        positions: {
                            create: {
                                positions_id: position.id,
                                status: data.status,
                                start_at: data.start_at,
                            }
                        },
                        government_ids: {
                            create: {
                                id_label: data.govt_id_label,
                                id_number: data.govt_id_number,
                            }
                        },
                        personal_information: {
                            create: {
                                surname: 'marandang',
                                firstname: 'hamodi',
                                sex: 'male',
                                civil_status: 'single',
                                nationality: 'Philippines',
                            }
                        }
                    },

                },
            },
        });
        console.log(`Created user with id: ${user.id}`);

    }

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });