//src\app\(protected)\(admin)\employees\[id]\page.tsx
import { prisma } from "@/lib/prisma";
import StudentPage from "./StudentPage";
import { getStudentDetails } from "@/actions/students/enrollment_details/action";
import { getPersonalInformation } from "@/actions/students/personal_information/actions";
import { getUsers } from "@/actions/users/action";
import { getAddress } from "@/actions/students/address/action";
import { getFamilyBackground } from "@/actions/students/family_background/action";
import { getEducationalBackground } from "@/actions/students/educational_background/action";

export default async function Page({ params }: { params: Promise<{ id_number: string }> }) {

    const { id_number: id_number } = await params;

    const semester = await prisma.semesters.findUnique({
        where: {
            semester: "first semester"
        },
        select: {
            id: true,
        }
    })

    const acad_year = await prisma.acad_years.findUnique({
        where: {
            acad_year: "2026-2027"
        },
        select: {
            id: true,
        }
    })

    const studentId = await prisma.students.findFirst({
        where: {
            id_number: id_number,
        }, select: {
            id: true,
            id_number: true,
            biography: {
                select: {
                    users_id: true,
                }
            }
        }
    })

    if (!studentId) {
        return null
    }

    const user = await getUsers(studentId?.biography?.users_id || "");
    const student_details = await getStudentDetails(studentId?.id || "");
    const personal_information = await getPersonalInformation(studentId?.id || "");
    const address = await getAddress(studentId?.id || "");
    const family_background = await getFamilyBackground(studentId?.id || "");
    const educational_background = await getEducationalBackground(studentId?.id || "");

    // 3. Pass the fetched data to the Client Component
    return <StudentPage role="moderator"
        user={user} student_details={student_details} personal_information={personal_information}
        address={address} family_background={family_background} educational_background={educational_background} />;
}