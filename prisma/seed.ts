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
            rank: "Staff", rank_order: 1
        },
        {
            username: "rasino", email: "rasino@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04001", department: "College of Business and Accountancy", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "asiño", firstname: "roman", contact_number: "961 096 8091", birthdate: new Date("09/27/1960"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "03-7964272" },
                { id_label: "Philhealth Number", id_number: "019-000024960-6" },
                { id_label: "Pag-ibig Number", id_number: "121146788115" },
                { id_label: "TIN Number", id_number: "135-233-141-000" },
            ],
            rank: "Professor", rank_order: 6
        },
        {
            username: "jbinasoy", email: "jbinasoy@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04003", department: "College of Psychology", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "binasoy", firstname: "juliet", contact_number: "09361428152", birthdate: new Date("07/03/1975"),
            sex: "female", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "33-3662238-2" },
                { id_label: "Philhealth Number", id_number: "08-050964999-9" },
                { id_label: "Pag-ibig Number", id_number: "1210-6149-5990" },
                { id_label: "TIN Number", id_number: "434-121-008-000" },
            ],
            rank: "Associate Professor", rank_order: 5
        },
        {
            username: "emantala", email: "emantala@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04004", department: "College of Criminology", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "mantala", firstname: "emman", contact_number: "09359683330", birthdate: new Date("08/27/1983"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "339353951" },
                { id_label: "Philhealth Number", id_number: "509022504880" },
                { id_label: "Pag-ibig Number", id_number: "081470010720" },
                { id_label: "TIN Number", id_number: "39251305029" },
            ],
            rank: "Assistant Professor", rank_order: 4
        },
        {
            username: "ddadis", email: "ddadis@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04010", department: "office of the student affairs", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "dadis", firstname: "dailene", contact_number: "09985741401", birthdate: new Date("01/29/1998"),
            sex: "female", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "08-2534194" },
                { id_label: "Pag-ibig Number", id_number: "35-4" },
            ],
            rank: "Instructor I", rank_order: 2
        },
        {
            username: "jagayo", email: "jagayo@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04005", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "agayo", firstname: "johanna", contact_number: "09166133994", birthdate: new Date("10/25/1986"),
            sex: "female", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "04-1730856-0" },
                { id_label: "Philhealth Number", id_number: "01-050501569-5" },
                { id_label: "Pag-ibig Number", id_number: "1010-0184-7096" },
                { id_label: "TIN Number", id_number: "246-747-567" },
            ],
            rank: "Instructor I", rank_order: 2
        },
        {
            username: "falomia", email: "falomia@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04006", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "alomia", firstname: "florando", contact_number: "09277479975", birthdate: new Date("10/10/1987"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "04-1995682-6" },
                { id_label: "Philhealth Number", id_number: "08-050785996-1" },
                { id_label: "Pag-ibig Number", id_number: "102001641135" },
                { id_label: "TIN Number", id_number: "261-861-691" },
            ],
            rank: "Instructor II", rank_order: 3
        },
        {
            username: "acantilleps", email: "acantilleps@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04007", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "cantilleps", firstname: "andre john", contact_number: "0916-214-0017", birthdate: new Date("04/21/1980"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "33-6064845-5" },
                { id_label: "Philhealth Number", id_number: "19-090309262-2" },
                { id_label: "Pag-ibig Number", id_number: "208-056-377" },
            ],
            rank: "Instructor I", rank_order: 2
        },
        {
            username: "acarpena", email: "acarpena@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04008", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "carpena", firstname: "antonino", contact_number: "09917865287", birthdate: new Date("07/22/1962"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "036977694" },
                { id_label: "Philhealth Number", id_number: "9102000841136" },
                { id_label: "Pag-ibig Number", id_number: "102000841136" },
                { id_label: "TIN Number", id_number: "171373875" },
            ],
            rank: "Instructor I", rank_order: 2
        },
        {
            username: "acaya", email: "acaya@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04009", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "caya", firstname: "abner", contact_number: "09266125510", birthdate: new Date("03/31/1988"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "342685033" },
                { id_label: "Philhealth Number", id_number: "630510453359" },
                { id_label: "Pag-ibig Number", id_number: "121087006089" },
                { id_label: "TIN Number", id_number: "434905951" },
            ],
            rank: "Instructor I", rank_order: 2
        },
        {
            username: "cdetera", email: "cdetera@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04012", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "detera", firstname: "christopher ian", contact_number: "09937148007", birthdate: new Date("01/04/1987"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "04-201-4567-1" },
                { id_label: "Philhealth Number", id_number: "2200-0156-4625" },
                { id_label: "Pag-ibig Number", id_number: "1210-8915-7983" },
                { id_label: "TIN Number", id_number: "265-537-311" },
            ],
            rank: "Instructor I", rank_order: 2
        },
        {
            username: "mdumaguing", email: "mdumaguing@lakeshore.edu.ph", password: hashedPassword, role: "moderator",
            id_number: "CL04013", department: "human resource", position: "hr officer", division: "Academics", hired_at: new Date(),
            surname: "dumaguing", firstname: "marife", contact_number: "09088150476", birthdate: new Date("05/07/1976"),
            sex: "female", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "33-5279207-6" },
                { id_label: "Philhealth Number", id_number: "190507793510" },
                { id_label: "Pag-ibig Number", id_number: "109001457425" },
                { id_label: "TIN Number", id_number: "217954031" },
            ],
            rank: "Officer", rank_order: 7
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

            const position = await prisma.positions.upsert({
                where: { position: positionStr },
                update: {},
                create: {
                    position: positionStr,
                    departments_id: department.id
                },
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
                            positions_id: position.id,
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