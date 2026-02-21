//src\app\(protected)\(admin)\employees\[id]\page.tsx
import { getDepartments } from "@/actions/admin/settings/departments/get";
import { getDivisions } from "@/actions/admin/settings/divisions/get";
import { getPositions } from "@/actions/admin/settings/positions/get";
import { getAddress, getEducationalBackground, getEligibility, getEmployeeDetails, getFamilyBackground, getPersonalInformation, getUsers, getWorkExperience } from "@/actions/employees/id/get";
import ProfilePage from "@/components/hris/profile/ProfilePage";

import { prisma } from "@/lib/prisma";

export default async function Page({ params }: { params: Promise<{ id_number: string }> }) {

    const { id_number: id_number } = await params;

    const employeeId = await prisma.employees.findUnique({
        where: {
            id_number: id_number,
        }, select: {
            users_id: true,
        }
    })

    if (!employeeId) {
        return null
    }

    const user = await getUsers(employeeId?.users_id || "");
    const employment_details = await getEmployeeDetails(employeeId?.users_id || "");
    const personal_information = await getPersonalInformation(employeeId?.users_id || "");
    const address = await getAddress(employeeId?.users_id || "");
    const family_background = await getFamilyBackground(employeeId?.users_id || "");
    const educational_background = await getEducationalBackground(employeeId?.users_id || "");
    const eligibility = await getEligibility(employeeId?.users_id || "");
    const work_experience = await getWorkExperience(employeeId?.users_id || "");

    const departments = await getDepartments();
    const divisions = await getDivisions();
    const positions = await getPositions();



    // 3. Pass the fetched data to the Client Component
    return <ProfilePage role="moderator" user={user} personal_information={personal_information} employment_details={employment_details} address={address} family_background={family_background} educational_background={educational_background} eligibility={eligibility} work_experience={work_experience} divisions={divisions} departments={departments} positions={positions} />;
}