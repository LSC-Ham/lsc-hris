// prisma/seed.ts

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

export async function main() {
    const hashedPassword = await bcrypt.hash("@lakeshore123", SALT_ROUNDS);

    // 2. Define your fully mapped sample data
    const seeds = [
        {
            username: "hmarandang", email: "hmarandang@lakeshore.edu.ph", password: hashedPassword, role: "admin",
            id_number: "ad03069", department: "Information Technology", position: "IT Personnel", division: "Administration", hired_at: new Date(),
            surname: "marandang", firstname: "hamodi", contact_number: "9958956869", birthdate: new Date("05/31/2001"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [],
        },
        {
            username: "rasino", email: "rasino@lakeshore.edu.ph", password: hashedPassword, role: "moderator",
            id_number: "CL04001", department: "Human Resource", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "asiño", firstname: "roman", contact_number: "961 096 8091", birthdate: new Date("09/27/1960"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "03-7964272" },
                { id_label: "Philhealth Number", id_number: "019-000024960-6" },
                { id_label: "Pag-ibig Number", id_number: "121146788115" },
                { id_label: "TIN Number", id_number: "135-233-141-000" },
            ],
        },
        {
            username: "jbinasoy", email: "jbinasoy@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04003", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "binasoy", firstname: "juliet", contact_number: "09361428152", birthdate: new Date("07/03/1975"),
            sex: "female", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "33-3662238-2" },
                { id_label: "Philhealth Number", id_number: "08-050964999-9" },
                { id_label: "Pag-ibig Number", id_number: "1210-6149-5990" },
                { id_label: "TIN Number", id_number: "434-121-008-000" },
            ],
        },
        {
            username: "emantala", email: "emantala@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04004", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "mantala", firstname: "emman", contact_number: "09359683330", birthdate: new Date("08/27/1983"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "339353951" },
                { id_label: "Philhealth Number", id_number: "509022504880" },
                { id_label: "Pag-ibig Number", id_number: "081470010720" },
                { id_label: "TIN Number", id_number: "39251305029" },
            ],
        },
        {
            username: "ddadis", email: "ddadis@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04010", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "dadis", firstname: "dailene", contact_number: "09985741401", birthdate: new Date("01/29/1998"),
            sex: "female", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "08-2534194" },
                { id_label: "Pag-ibig Number", id_number: "35-4" },
            ],
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
        },
        {
            username: "mdumaguing", email: "mdumaguing@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04013", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "dumaguing", firstname: "marife", contact_number: "09088150476", birthdate: new Date("05/07/1976"),
            sex: "female", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "33-5279207-6" },
                { id_label: "Philhealth Number", id_number: "190507793510" },
                { id_label: "Pag-ibig Number", id_number: "109001457425" },
                { id_label: "TIN Number", id_number: "217954031" },
            ],
        },
        {
            username: "pfontanares", email: "pfontanares@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04014", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "fontanares", firstname: "pilita", contact_number: "09420672594", birthdate: new Date("10/13/1975"),
            sex: "female", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "33-3774250-4" },
                { id_label: "Philhealth Number", id_number: "19-051436097-2" },
                { id_label: "Pag-ibig Number", id_number: "1050-0021-2845" },
                { id_label: "TIN Number", id_number: "200-541-892" },
            ],
        },
        {
            username: "jignacio", email: "jignacio@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04015", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "ignacio", firstname: "jennifar", contact_number: "09166202357", birthdate: new Date("03/06/1991"),
            sex: "female", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "0100025276" },
                { id_label: "Philhealth Number", id_number: "801211862880" },
                { id_label: "Pag-ibig Number", id_number: "60315227096" },
            ],
        },
        {
            username: "emanuel", email: "emanuel@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04016", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "manuel", firstname: "edward", contact_number: "09088965316", birthdate: new Date("03/25/1986"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "04-1392254-2" },
                { id_label: "Philhealth Number", id_number: "01-000243782-7" },
                { id_label: "Pag-ibig Number", id_number: "1210-6619-1580" },
                { id_label: "TIN Number", id_number: "227-648-108" },
            ],
        },
        {
            username: "fmasaga", email: "fmasaga@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04017", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "masaga", firstname: "fe", contact_number: "09205206054", birthdate: new Date("04/08/1955"),
            sex: "female", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "04-0230946-4 - (PENSIONER)" },
                { id_label: "Philhealth Number", id_number: "19-025039487-3" },
                { id_label: "Pag-ibig Number", id_number: "124-386-463-000" },
            ],
        },
        {
            username: "mmendoza", email: "mmendoza@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04018", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "mendoza", firstname: "marissa mae", contact_number: "09279131156", birthdate: new Date("10/08/1981"),
            sex: "female", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "332670859" },
                { id_label: "Philhealth Number", id_number: "101-050050486-8" },
                { id_label: "Pag-ibig Number", id_number: "121085518219" },
                { id_label: "TIN Number", id_number: "256414134000" },
            ],
        },
        {
            username: "docampo", email: "docampo@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04020", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "ocampo", firstname: "dianne", contact_number: "09171096745", birthdate: new Date("10/27/1995"),
            sex: "female", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "0802621342" },
                { id_label: "Philhealth Number", id_number: "491211725127" },
                { id_label: "Pag-ibig Number", id_number: "53328-904-799" },
            ],
        },
        {
            username: "jocampo", email: "jocampo@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04021", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "ocampo", firstname: "john matthew", contact_number: "09162112212", birthdate: new Date("04/20/1990"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "08-051422867-5" },
                { id_label: "Philhealth Number", id_number: "121094440445" },
                { id_label: "Pag-ibig Number", id_number: "440-918-071" },
            ],
        },
        {
            username: "jotilla", email: "jotilla@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04022", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "otilla", firstname: "jie ann", contact_number: "09182489968", birthdate: new Date("11/22/1987"),
            sex: "female", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "02-2595408-3" },
                { id_label: "Philhealth Number", id_number: "05-0501258986" },
                { id_label: "Pag-ibig Number", id_number: "121082501435" },
                { id_label: "TIN Number", id_number: "267-061-267-000" },
            ],
        },
        {
            username: "aperez", email: "aperez@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04023", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "perez", firstname: "albert", contact_number: "09237440788", birthdate: new Date("09/21/1988"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "04-2582038-6" },
                { id_label: "Philhealth Number", id_number: "08-051175303-5" },
                { id_label: "Pag-ibig Number", id_number: "1210-3865-4520" },
                { id_label: "TIN Number", id_number: "424-163-789-000" },
            ],
        },
        {
            username: "hsanpedro", email: "hsanpedro@lakeshore.edu.ph", password: hashedPassword, role: "user",
            id_number: "CL04024", department: "College", position: "Faculty", division: "Academics", hired_at: new Date(),
            surname: "san pedro", firstname: "herbert", contact_number: "09451529000", birthdate: new Date("09/22/1974"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "33-2718787-8" },
                { id_label: "Philhealth Number", id_number: "0805-0230-0141" },
                { id_label: "Pag-ibig Number", id_number: "102000938994" },
                { id_label: "TIN Number", id_number: "141-851-460" },
            ],
        },
    ];

    console.log(`Start seeding ...`);

    for (const data of seeds) {
        // 3. Upsert lookup tables (creates them only if they don't exist)
        const department = await prisma.departments.upsert({
            where: { department: data.department },
            update: {},
            create: { department: data.department },
        });

        const position = await prisma.positions.upsert({
            where: { position: data.position },
            update: {},
            create: { position: data.position },
        });

        const division = await prisma.divisions.upsert({
            where: { division: data.division },
            update: {},
            create: { division: data.division },
        });

        // 4. Create User, Employee, Personal Info, and Government IDs all at once
        const user = await prisma.user.upsert({
            where: { username: data.username },
            update: {}, // Skip if username already exists
            create: {
                username: data.username,
                email: data.email,
                password: data.password,
                role: data.role,
                employees: {
                    create: {
                        id_number: data.id_number,
                        hired_at: data.hired_at,
                        departments_id: department.id,
                        divisions_id: division.id,

                        // Create associated position mapping
                        positions: {
                            create: {
                                positions_id: position.id,
                                status: "Full-Time",
                                start_at: new Date(),
                            }
                        },

                        // Create Personal Information dynamically
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

                        // Create Government IDs dynamically (will skip if array is empty)
                        ...(data.government_ids.length > 0 && {
                            government_ids: {
                                create: data.government_ids,
                            }
                        })
                    }
                }
            },
        });
        console.log(`Created user with id: ${user.id} (${data.firstname} ${data.surname})`);
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