//src\app\(protected)\[id_number]\page.tsx
import { getAddress } from "@/actions/employees/address/action";
import { getEducationalBackground } from "@/actions/employees/educational_background/route";
import { getEligibility } from "@/actions/employees/eligibility/action";
import { getEmployeeDetails } from "@/actions/employees/employment_details/action";
import { getFamilyBackground } from "@/actions/employees/family_background/action";
import { getPersonalInformation } from "@/actions/employees/personal_information/actions";
import { getUsers } from "@/actions/employees/users/action";
import { getWorkExperience } from "@/actions/employees/work_experience/action";
import ProfilePage from "@/components/hris/profile/ProfilePage";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id_number: string }> }) {
    const session = await getServerSession(authOptions);
    const { id_number } = await params;

    const userId = (session?.user as any).id || "";

    const employeeId = await prisma.employees.findFirst({
        where: {
            users_id: userId
        },
        select: { id_number: true, id: true, users_id: true, }
    });

    if (!employeeId || employeeId.id_number !== id_number) {
        return redirect("/hris/dashboard")
    }

    const user = await getUsers(employeeId?.users_id || "");
    const employment_details = await getEmployeeDetails(employeeId?.id || "");
    const personal_information = await getPersonalInformation(employeeId?.id || "");
    const address = await getAddress(employeeId?.id || "");
    const family_background = await getFamilyBackground(employeeId?.id || "");
    const educational_background = await getEducationalBackground(employeeId?.id || "");
    const eligibility = await getEligibility(employeeId?.id || "");
    const work_experience = await getWorkExperience(employeeId?.id || "");


    // 3. Pass the fetched data to the Client Component
    return <ProfilePage
        role={null}
        user={user}
        personal_information={personal_information}
        employment_details={employment_details}
        address={address}
        family_background={family_background}
        educational_background={educational_background}
        eligibility={eligibility}
        work_experience={work_experience}
    />;
}