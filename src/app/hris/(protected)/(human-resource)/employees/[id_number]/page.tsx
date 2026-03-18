//src\app\(protected)\(admin)\employees\[id]\page.tsx
import { getDepartments } from "@/actions/admin/settings/departments/action";
import { getDivisions } from "@/actions/admin/settings/divisions/action";
import { getPositions } from "@/actions/admin/settings/positions/action";
import { getAddress } from "@/actions/employees/address/action";
import { getEducationalBackground } from "@/actions/employees/educational_background/action";
import { getEligibility } from "@/actions/employees/eligibility/action";
import { getEmployeeDetails } from "@/actions/employees/employment_details/action";
import { getFamilyBackground } from "@/actions/employees/family_background/action";
import { getPersonalInformation } from "@/actions/employees/personal_information/actions";
import { getWorkExperience } from "@/actions/employees/work_experience/action";
import { getUsers } from "@/actions/users/action";
import EmployeePage from "@/app/hris/(protected)/(human-resource)/employees/[id_number]/EmployeePage";

import { prisma } from "@/lib/prisma";

export default async function Page({ params }: { params: Promise<{ id_number: string }> }) {

    const { id_number: id_number } = await params;

    const employeeId = await prisma.employees.findUnique({
        where: { id_number: id_number }, select: {
            id: true,
            biography: { select: { users_id: true, } }
        }
    })

    if (!employeeId) {
        return null
    }

    const user = await getUsers(employeeId?.biography?.users_id || "");
    const employment_details = await getEmployeeDetails(employeeId?.id || "");
    const personal_information = await getPersonalInformation(employeeId?.id || "");
    const address = await getAddress(employeeId?.id || "");
    const family_background = await getFamilyBackground(employeeId?.id || "");
    const educational_background = await getEducationalBackground(employeeId?.id || "");
    const eligibility = await getEligibility(employeeId?.id || "");
    const work_experience = await getWorkExperience(employeeId?.id || "");

    const departments = await getDepartments();
    const departmentNames = departments.map((dept) => dept.department);

    const divisions = await getDivisions();
    const divisionNames = divisions.map((div) => div.division);

    const positions = await getPositions();
    const positionNames = positions.map((pos) => pos.position);


    return <EmployeePage role="moderator"
        user={user} personal_information={personal_information}
        employment_details={employment_details} address={address}
        family_background={family_background}
        educational_background={educational_background}
        eligibility={eligibility} work_experience={work_experience}
        divisions={divisionNames} departments={departmentNames} positions={positionNames} />;
}