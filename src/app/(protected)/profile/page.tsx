import { getPersonalInformation } from "@/actions/users/employees"; // Import your fetch function
import { getEmployeeDetails } from "@/actions/users/employees";
import ProfilePage from "./ProfilePage";

export default async function Page() {
    const employment_details = await getEmployeeDetails();
    const personal_information = await getPersonalInformation();


    if (!personal_information || !employment_details) {
        return <div>Error loading profile. Please try logging in again.</div>;
    }


    // 3. Pass the fetched data to the Client Component
    return <ProfilePage personal_information={personal_information} employment_details={employment_details} />;
}