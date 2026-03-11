// src\app\(protected)\(admin)\employees\[id_number]\page.tsx
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

    const userId = (session.user as any).id || "";

    const studentId = await prisma.students.findFirst({
        where: { id_number: id_number },
        select: {
            id: true,
            id_number: true,
            biography: { select: { users_id: true } }
        }
    });

    if (!studentId) {
        return null;
    }

    const user = await getUsers(studentId?.biography?.users_id || "");
    const student_details = await getStudentDetails(studentId?.id || "");
    const personal_information = await getPersonalInformation(studentId?.id || "");
    const address = await getAddress(studentId?.id || "");
    const family_background = await getFamilyBackground(studentId?.id || "");
    const educational_background = await getEducationalBackground(studentId?.id || "");

    const acadYears = await getAcadYears();
    const acadYearNames = acadYears.map((y) => y.acad_year);

    const semesters = await getSemesters();
    const semesterNames = semesters.map((s) => s.semester);

    const scholarships = await getScholarships();
    const scholarshipNames = scholarships.map((scholarship) => scholarship.scholarship);

    const acadLevels = await getAcadLevel();
    const courses = await getCourses();
    const years = await getYears();
    const sections = await getSections();

    const courseCodes = courses.map(c => c.course_code)
    const acadLevelData = acadLevels.map(l => ({ id: l.id, name: l.acad_level_name }));
    const yearsData = years.map(y => ({ id: y.id, year: y.year, acad_level_id: y.acad_level_id }));
    const sectionsData = sections.map(s => ({ id: s.id, section: s.section, acad_level_id: s.acad_level_id }));

    return (
        <StudentPage
            role="moderator"
            user={user}
            student_details={student_details}
            personal_information={personal_information}
            address={address}
            family_background={family_background}
            educational_background={educational_background}
            acadYears={acadYearNames}
            semesters={semesterNames}
            acadLevel={acadLevelData}
            courses={courseCodes}
            years={yearsData}
            sections={sectionsData}
            scholarships={scholarshipNames}
        />
    );
}