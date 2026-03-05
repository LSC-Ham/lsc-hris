//src\app\(protected)\[id_number]\page.tsx
import { getAddress } from "@/actions/employees/address/action";
import { getEducationalBackground } from "@/actions/employees/educational_background/route";
import { getEligibility } from "@/actions/employees/eligibility/action";
import { getEmployeeDetails } from "@/actions/employees/employment_details/action";
import { getFamilyBackground } from "@/actions/employees/family_background/action";
import { getPersonalInformation } from "@/actions/employees/personal_information/actions";
import { getUsers } from "@/actions/employees/users/action";
import { getWorkExperience } from "@/actions/employees/work_experience/action";
import EmployeePage from "@/app/hris/(protected)/(human-resource)/employees/[id_number]/EmployeePage";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id_number: string }> }) {
    const session = await getServerSession(authOptions);
    const { id_number } = await params;

    const userId = (session?.user as any).id || "";

    const biography = await prisma.biography.findFirst({
        where: {
            users_id: userId
        },
        select: {
            users_id: true,
            employees: {
                select: {
                    id: true,
                    id_number: true,
                }
            }
        }
    });

    if (!biography || biography.employees?.id_number !== id_number) {
        return redirect("/hris/dashboard")
    }

    const user = await getUsers(biography?.users_id || "");
    const employment_details = await getEmployeeDetails(biography?.employees?.id || "");
    const personal_information = await getPersonalInformation(biography?.employees?.id || "");
    const address = await getAddress(biography?.employees?.id || "");
    const family_background = await getFamilyBackground(biography?.employees?.id || "");
    const educational_background = await getEducationalBackground(biography?.employees?.id || "");
    const eligibility = await getEligibility(biography?.employees?.id || "");
    const work_experience = await getWorkExperience(biography?.employees?.id || "");


    // 3. Pass the fetched data to the Client Component
    return <EmployeePage
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