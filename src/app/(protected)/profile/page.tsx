//src\app\(protected)\profile\page.tsx
import { getAddress, getFamilyBackground, getPersonalInformation, getEmployeeDetails, getEducationalBackground, getEligibility, getWorkExperience, getUsers } from "@/actions/employees/get"; // Import your fetch function
import ProfilePage from "@/components/profile/ProfilePage";

export default async function Page() {
    const user = await getUsers();
    const employment_details = await getEmployeeDetails();
    const personal_information = await getPersonalInformation();
    const address = await getAddress();
    const family_background = await getFamilyBackground();
    const educational_background = await getEducationalBackground();
    const eligibility = await getEligibility();
    const work_experience = await getWorkExperience();


    if (!user || !personal_information || !employment_details || !address || !family_background || !educational_background || !eligibility || !work_experience) {
        return <div>Error loading profile. Please try logging in again.</div>;
    }


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