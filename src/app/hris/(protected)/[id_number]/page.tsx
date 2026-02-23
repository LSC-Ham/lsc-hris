//src\app\(protected)\[id_number]\page.tsx
import { getAddress, getFamilyBackground, getPersonalInformation, getEmployeeDetails, getEducationalBackground, getEligibility, getWorkExperience, getUsers } from "@/actions/employees/profile/get"; // Import your fetch function
import ProfilePage from "@/components/hris/profile/ProfilePage";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id_number: string }> }) {
    const session = await getServerSession(authOptions);
    const { id_number } = await params;

    const userId = (session?.user as any).id || "";

    const currentUser = await prisma.employees.findFirst({
        where: {
            users_id: userId
        },
        select: { id_number: true }
    });

    if (!currentUser || currentUser.id_number !== id_number) {
        return redirect("/hris/dashboard")
    }

    const user = await getUsers();
    const employment_details = await getEmployeeDetails();
    const personal_information = await getPersonalInformation();
    const address = await getAddress();
    const family_background = await getFamilyBackground();
    const educational_background = await getEducationalBackground();
    const eligibility = await getEligibility();
    const work_experience = await getWorkExperience();


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