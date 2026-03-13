// prisma/seed.ts

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

export async function main() {
    const hashedPassword = await bcrypt.hash("@lakeshore123", SALT_ROUNDS);

    const fixedColleges = [
        {
            department: "College of Business and Accountancy",
            courses: ["bsrem", "bsa", "bsma"]
        },
        {
            department: "College of Psychology",
            courses: ["bspsych"]
        },
        {
            department: "College of Criminology",
            courses: ["bscrim"]
        }
    ];

    const fixedAcadYears = [
        { acad_year: "2025-2026", order: 1 },
        { acad_year: "2026-2027", order: 2 },
    ];

    const fixedSemesters = [
        { semester: "first semester", order: 1 },
        { semester: "second semester", order: 2 },
    ];

    const fixedAcadLevels = [
        {
            code: "jhs", name: "junior high school", order: 1,
            years: [
                { name: "grade 7", order: 1 }, { name: "grade 8", order: 2 },
                { name: "grade 9", order: 3 }, { name: "grade 10", order: 4 }
            ]
        },
        {
            code: "shs", name: "senior high school", order: 2,
            years: [
                { name: "grade 11", order: 5 }, { name: "grade 12", order: 6 }
            ]
        },
        {
            code: "col", name: "college", order: 3,
            years: [
                { name: "first year", order: 7 }, { name: "second year", order: 8 },
                { name: "third year", order: 9 }, { name: "fourth year", order: 10 }
            ]
        }
    ];

    console.log(`Pre-seeding fixed colleges and courses...`);
    for (const college of fixedColleges) {
        const dept = await prisma.departments.upsert({
            where: { department: college.department },
            update: {},
            create: { department: college.department },
        });

        for (const courseCode of college.courses) {
            await prisma.courses.upsert({
                where: { course_code: courseCode },
                update: { department_id: dept.id },
                create: {
                    course_code: courseCode,
                    department_id: dept.id,
                    created_by: "seeds"
                },
            });
        }
    }

    console.log(`Pre-seeding academic years...`);
    for (const ay of fixedAcadYears) {
        await prisma.acad_years.upsert({
            where: { acad_year: ay.acad_year },
            update: { order: ay.order },
            create: { acad_year: ay.acad_year, order: ay.order }
        });
    }

    console.log(`Pre-seeding semesters...`);
    for (const sem of fixedSemesters) {
        await prisma.semesters.upsert({
            where: { semester: sem.semester },
            update: { order: sem.order },
            create: { semester: sem.semester, order: sem.order }
        });
    }

    console.log(`Pre-seeding academic levels and year levels...`);
    for (const level of fixedAcadLevels) {
        const acadLevel = await prisma.acad_level.upsert({
            where: { acad_level_code: level.code },
            update: { acad_level_name: level.name, order: level.order },
            create: { acad_level_code: level.code, acad_level_name: level.name, order: level.order }
        });

        for (const year of level.years) {
            await prisma.years.upsert({
                where: { year: year.name },
                update: { order: year.order, acad_level_id: acadLevel.id },
                create: { year: year.name, order: year.order, acad_level_id: acadLevel.id }
            });
        }
    }

    const seed = [
        {
            // user
            username: "hmarandang", email: "hmarandang@lakeshore.edu.ph", password: hashedPassword, role: "admin",
            //personal information
            surname: "marandang", firstname: "hamodi", contact_number: "9958956869", birthdate: new Date("05/31/2001"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [],
            //employee
            id_number: "ad03069", department: "Information Technology", position: "IT Personnel", division: "Administration", hired_at: new Date(),
            //student
            student_id: "2025-P0001", semester: "first semester", acad_year: "2026-2027",
            course_code: "bspsych", acad_level_code: "col", year: "second year", section: "",
        },
        {
            // user
            username: "lcontreras", email: "lcontreras@lakeshore.edu.ph", password: hashedPassword, role: "user",
            //personal information
            surname: "contreras", firstname: "lance", contact_number: "09123456789", birthdate: new Date("05/31/2001"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            //employee
            id_number: "", government_ids: [], department: "", position: "", division: "",
            //student
            student_id: "2025-0106", semester: "first semester", acad_year: "2026-2027",
            course_code: "acad", acad_level_code: "shs", year: "grade 12", section: "faith",
        },
        {
            //user
            username: "rasino", email: "rasino@lakeshore.edu.ph", password: hashedPassword, role: "moderator",
            //employee
            id_number: "CL04001", department: "College of Business and Accountancy", position: "Faculty", division: "Academics", hired_at: new Date(),
            //personal information
            surname: "asiño", firstname: "roman", contact_number: "961 096 8091", birthdate: new Date("09/27/1960"),
            sex: "male", civil_status: "single", nationality: "Philippines",
            government_ids: [
                { id_label: "SSS Number", id_number: "03-7964272" },
                { id_label: "Philhealth Number", id_number: "019-000024960-6" },
                { id_label: "Pag-ibig Number", id_number: "121146788115" },
                { id_label: "TIN Number", id_number: "135-233-141-000" },
            ],
            //student
            student_id: "2025-C2025", semester: "second semester", acad_year: "2025-2026",
            course_code: "bspsych", acad_level_code: "col", year: "first year", section: "",
        },
        {
            username: "jbinasoy", email: "jbinasoy@lakeshore.edu.ph", password: hashedPassword, role: "moderator",
            id_number: "CL04003", department: "College of Psychology", position: "Faculty", division: "Academics", hired_at: new Date(),
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
            username: "emantala", email: "emantala@lakeshore.edu.ph", password: hashedPassword, role: "moderator",
            id_number: "CL04004", department: "College of Criminology", position: "Faculty", division: "Academics", hired_at: new Date(),
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
            id_number: "CL04010", department: "office of the student affairs", position: "Faculty", division: "Academics", hired_at: new Date(),
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
        },
    ];

    // ==========================================
    // 4. EXECUTE USER SEEDING
    // ==========================================
    console.log(`Start employing and enrolling...`);

    for (const data of seed) {
        // Identify if the user is an Employee, a Student, or both
        const isEmployee = Boolean(data.id_number && data.id_number.trim() !== "");
        // @ts-ignore
        const isStudent = Boolean(data.student_id && data.student_id.trim() !== "");

        let employeePayload = undefined;
        let studentPayload = undefined;

        // --- HANDLE EMPLOYEE LOGIC ---
        if (isEmployee) {
            const deptStr = data.department || "Unassigned";
            const divisionStr = data.division || "Unassigned";
            const positionStr = data.position || "Unassigned";

            const department = await prisma.departments.upsert({
                where: { department: deptStr }, update: {}, create: { department: deptStr },
            });

            const division = await prisma.divisions.upsert({
                where: { division: divisionStr }, update: {}, create: { division: divisionStr },
            });

            const position = await prisma.positions.upsert({
                where: { position: positionStr }, update: {}, create: { position: positionStr },
            });

            employeePayload = {
                create: {
                    id_number: data.id_number,
                    hired_at: data.hired_at || new Date(),
                    departments_id: department.id,
                    divisions_id: division.id,
                    positions: {
                        create: {
                            positions_id: position.id,
                            status: "Full-Time",
                            start_at: new Date(),
                        }
                    },
                    ...(data.government_ids && data.government_ids.length > 0 && {
                        government_ids: { create: data.government_ids }
                    })
                }
            };
        }

        // --- HANDLE STUDENT LOGIC ---
        if (isStudent) {
            // @ts-ignore
            const semesterStr = data.semester || "";
            // @ts-ignore
            const acadYearStr = data.acad_year || "";
            // @ts-ignore
            const acadLevelCodeStr = data.acad_level_code || "";
            // @ts-ignore
            const yearStr = data.year || "";
            // @ts-ignore
            const courseCodeStr = data.course_code || "";
            // @ts-ignore
            const sectionStr = data.section || "";

            const semester = await prisma.semesters.findUnique({ where: { semester: semesterStr } });
            const acad_year = await prisma.acad_years.findUnique({ where: { acad_year: acadYearStr } });
            const acad_level = await prisma.acad_level.findUnique({ where: { acad_level_code: acadLevelCodeStr } });
            const year_level = await prisma.years.findUnique({ where: { year: yearStr } });

            if (!semester || !acad_year || !acad_level || !year_level) {
                console.warn(`Missing required academic reference data for student ${data.student_id}. Skipping student profile creation.`);
            } else {
                let section = null;
                if (sectionStr.trim() !== "") {
                    section = await prisma.sections.upsert({
                        where: { section: sectionStr },
                        update: {},
                        create: { acad_level_id: acad_level.id, year_id: year_level.id, section: sectionStr }
                    });
                }

                // Course Logic with Fallback
                let course = await prisma.courses.findUnique({
                    where: { course_code: courseCodeStr }
                });

                if (!course) {
                    const fallbackDept = await prisma.departments.upsert({
                        where: { department: "General Academics" },
                        update: {},
                        create: { department: "General Academics" }
                    });

                    course = await prisma.courses.create({
                        data: {
                            department_id: fallbackDept.id,
                            course_code: courseCodeStr,
                            created_by: "seeds"
                        }
                    });
                }

                studentPayload = {
                    create: {
                        // @ts-ignore
                        id_number: data.student_id as string,
                        semester_id: semester.id,
                        acad_level_id: acad_level.id,
                        acad_year_id: acad_year.id,
                        course_id: course.id,
                        year_id: year_level.id,
                        ...(section && { sections_id: section.id }), // Only attach if a valid section exists
                    }
                };
            }
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
                        ...(employeePayload && { employees: employeePayload }),
                        ...(studentPayload && { students: studentPayload })
                    }
                }
            },
        });

        console.log(`Created user: ${user.id} (${data.firstname} ${data.surname}) - Employee: ${isEmployee}, Student: ${isStudent}`);
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