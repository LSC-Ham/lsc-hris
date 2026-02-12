import { getUserProfile } from "@/actions/users/employees"; // Import your fetch function
import ProfilePage from "./ProfilePage";

export default async function Page() {
    const userData = await getUserProfile();

    if (!userData) {
        return <div>Error loading profile. Please try logging in again.</div>;
    }

    // 3. Pass the fetched data to the Client Component
    return <ProfilePage initialData={userData} />;
}