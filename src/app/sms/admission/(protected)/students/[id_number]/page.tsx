// src\app\sms\admission\(protected)\students\[id_number]\page.tsx
import { prisma } from "@/lib/prisma";
import StudentPage from "./StudentPage";
import { getStudentDetails } from "@/actions/students/enrollment_details/action";
import { getPersonalInformation } from "@/actions/students/personal_information/actions";
import { getUsers } from "@/actions/users/action";
import { getAddress } from "@/actions/students/address/action";
import { getFamilyBackground } from "@/actions/students/family_background/action";
import { getEducationalBackground } from "@/actions/students/educational_background/action";
import { getAcadLevel } from "@/actions/admin/settings/sms/acad_level/action";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAcadYears } from "@/actions/admin/settings/sms/acad_years/action";
import { getSemesters } from "@/actions/admin/settings/sms/semesters/action";
import { getYears } from "@/actions/admin/settings/sms/years/action";
import { getSections } from "@/actions/admin/settings/sms/sections/action";
import { getScholarships } from "@/actions/admin/settings/scholarship/action";
import { getCourses } from "@/actions/admin/settings/sms/courses/action";

export default async function Page({ params }: { params: Promise<{ id_number: string }> }) {
    const { id_number } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return null;
    }

    const student = await prisma.students.findFirst({
        where: { id_number: id_number },
        select: {
            id: true,
            id_number: true,
            biography_id: true,
            biography: { select: { users_id: true } }
        }
    });

    if (!student) {
        return <div className="p-6 text-center text-red-500">Student not found.</div>;
    }

    const user = await getUsers(student.biography?.users_id || "");
    const personal_information = await getPersonalInformation(student.id);
    const address = await getAddress(student.id);
    const family_background = await getFamilyBackground(student.id);
    const educational_background = await getEducationalBackground(student.id);

    const student_details = await getStudentDetails(id_number);

    const acadYears = await getAcadYears();
    const semesters = await getSemesters();
    const scholarships = await getScholarships();
    const acadLevels = await getAcadLevel();
    const courses = await getCourses();
    const years = await getYears();
    const sections = await getSections();

    const acadYearData = acadYears.map((y) => ({ id: y.id, name: y.acad_year || "" }));
    const semesterData = semesters.map((s) => ({ id: s.id, name: s.semester || "" }));
    const scholarshipData = scholarships.map((s) => ({ id: s.id, name: s.scholarship || "" }));
    const courseData = courses.map((c) => ({ id: c.id, name: c.course_code || "" }));
    const acadLevelData = acadLevels.map((l) => ({ id: l.id, name: l.acad_level_name || "" }));

    // Keep parent IDs for dependent dropdowns (add fallbacks here too, just in case!)
    const yearsData = years.map((y) => ({
        id: y.id,
        year: y.year || "",
        acad_level_id: y.acad_level_id || ""
    }));

    const sectionsData = sections.map((s) => ({
        id: s.id,
        section: s.section || "",
        acad_level_id: s.acad_level_id || ""
    }));

    return (
        <StudentPage
            role="moderator"
            user={user}
            student_details={student_details}
            personal_information={personal_information}
            address={address}
            family_background={family_background}
            educational_background={educational_background}
            acadYears={acadYearData}
            semesters={semesterData}
            acadLevel={acadLevelData}
            courses={courseData}
            years={yearsData}
            sections={sectionsData}
            scholarships={scholarshipData}
        />
    );
}