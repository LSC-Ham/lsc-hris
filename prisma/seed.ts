import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function main() {
    const hashedPassword = await bcrypt.hash("@lakeshore123", SALT_ROUNDS);

    const seed = [
        {
            username: "hmarandang", email: "hmarandang@lakeshore.edu.ph", password: hashedPassword, role: "admin",
            surname: "marandang", firstname: "hamodi", contact_number: "9958956869", birthdate: new Date("05/31/2001"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [],
            id_number: "ad03069", department: "Information Technology", position: "IT Personnel", division: "Administration", hired_at: new Date(),
        },
        {
            username: "dobamos", email: "dobamos@lakeshore.edu.ph", password: hashedPassword, role: "admin",
            surname: "obamos", firstname: "dave", contact_number: "", birthdate: new Date("01/01/2000"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [],
            id_number: "ad03057", department: "Human Resource", position: "Recruitment Officer", division: "Administration", hired_at: new Date(),
        },
        {
            username: "edecena", email: "edecena@lakeshore.edu.ph", password: hashedPassword, role: "admin",
            surname: "decena", firstname: "elias rafael", contact_number: "", birthdate: new Date("01/01/2000"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [],
            id_number: "EX00027", department: "Board of Trustees", position: "Vice President for Administration", division: "Administration", hired_at: new Date(),
            rank: "Vice President", rank_order: 1
        },
    ];

    console.log(`Start employing and seeding users...`);

    for (const data of seed) {
        const isEmployee = Boolean(data.id_number && data.id_number.trim() !== "");
        let employeePayload = undefined;

        if (isEmployee) {
            const deptStr = data.department || "";
            const divisionStr = data.division || "";
            const positionStr = data.position || "";

            const rankStr = data.rank || "Unranked";
            const rankOrder = data.rank_order || 999;

            const department = await prisma.departments.upsert({
                where: { department: deptStr }, update: {}, create: { department: deptStr },
            });

            const division = await prisma.divisions.upsert({
                where: { division: divisionStr }, update: {}, create: { division: divisionStr },
            });

            const rank = await prisma.ranks.upsert({
                where: { rank: rankStr },
                update: {},
                create: {
                    rank: rankStr,
                    order: rankOrder,
                    description: `${rankStr} Description`
                }
            });

            employeePayload = {
                create: {
                    id_number: data.id_number,
                    hired_at: data.hired_at || new Date(),
                    departments_id: department.id,
                    divisions_id: division.id,
                    ranks_id: rank.id,
                    positions: {
                        create: {
                            positions: positionStr,
                            status: "Full-Time",
                            is_active: true,
                            start_at: new Date(),
                        }
                    },
                    ...(data.government_ids && data.government_ids.length > 0 && {
                        government_ids: { create: data.government_ids }
                    })
                }
            };
        }

        const user = await prisma.user.upsert({
            where: { username: data.username },
            update: {},
            create: {
                username: data.username,
                email: data.email,
                password: data.password,
                role: data.role,
                biography: {
                    create: {
                        personal_information: {
                            create: {
                                surname: data.surname,
                                firstname: data.firstname,
                                mobile_no: data.contact_number,
                                birthdate: data.birthdate,
                                sex: data.sex,
                                civil_status: data.civil_status,
                                nationality: data.nationality,
                            }
                        },
                        ...(employeePayload && { employees: employeePayload })
                    }
                }
            },
        });

        console.log(`Created user: ${user.id} (${data.firstname} ${data.surname}) - Employee: ${isEmployee}`);
    }

    console.log(`Seeding finished successfully.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });