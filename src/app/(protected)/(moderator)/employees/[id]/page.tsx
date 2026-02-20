//src\app\(protected)\(admin)\employees\[id]\page.tsx
import { getDepartments } from "@/actions/admin/settings/departments/get";
import { getDivisions } from "@/actions/admin/settings/divisions/get";
import { getPositions } from "@/actions/admin/settings/positions/get";
import { getAddress, getEducationalBackground, getEligibility, getEmployeeDetails, getFamilyBackground, getPersonalInformation, getWorkExperience } from "@/actions/employees/id/get";
import ProfilePage from "@/components/profile/ProfilePage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }
    const userRole = (session.user as any).role;

    const { id: employeeId } = await params;
    const employment_details = await getEmployeeDetails(employeeId);
    const personal_information = await getPersonalInformation(employeeId);
    const address = await getAddress(employeeId);
    const family_background = await getFamilyBackground(employeeId);
    const educational_background = await getEducationalBackground(employeeId);
    const eligibility = await getEligibility(employeeId);
    const work_experience = await getWorkExperience(employeeId);

    const departments = await getDepartments();
    const divisions = await getDivisions();
    const positions = await getPositions();


    if (!personal_information || !employment_details || !address || !family_background || !educational_background || !eligibility || !work_experience) {
        return <div>Error loading profile. Please try logging in again.</div>;
    }


    // 3. Pass the fetched data to the Client Component
    return <ProfilePage role={userRole} personal_information={personal_information} employment_details={employment_details} address={address} family_background={family_background} educational_background={educational_background} eligibility={eligibility} work_experience={work_experience} divisions={divisions} departments={departments} positions={positions} />;
}