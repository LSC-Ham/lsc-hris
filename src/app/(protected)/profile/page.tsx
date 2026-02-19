import { getAddress, getFamilyBackground, getPersonalInformation, getEmployeeDetails, getEducationalBackground, getEligibility } from "@/actions/employees/get"; // Import your fetch function
import ProfilePage from "./ProfilePage";

export default async function Page() {
    const employment_details = await getEmployeeDetails();
    const personal_information = await getPersonalInformation();
    const address = await getAddress();
    const family_background = await getFamilyBackground();
    const educational_background = await getEducationalBackground();
    const eligibility = await getEligibility();


    if (!personal_information || !employment_details || !address || !family_background || !educational_background || !eligibility) {
        return <div>Error loading profile. Please try logging in again.</div>;
    }


    // 3. Pass the fetched data to the Client Component
    return <ProfilePage
        personal_information={personal_information}
        employment_details={employment_details}
        address={address}
        family_background={family_background}
        educational_background={educational_background}
        eligibility={eligibility}
    />;
}