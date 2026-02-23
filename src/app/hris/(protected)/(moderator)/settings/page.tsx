// src/app/hris/(protected)/(moderator)/settings/page.tsx

import { getDepartments } from "@/actions/admin/settings/departments/action";
import { getDivisions } from "@/actions/admin/settings/divisions/action";
import { getPositions } from "@/actions/admin/settings/positions/actions";
import SettingsPage from "@/components/hris/settings/SettingsPage";


export default async function Page() {
    // 1. Fetch the data securely on the server
    const divisionsData = await getDivisions();
    const departmentsData = await getDepartments();
    const positionsData = await getPositions();

    // 2. Pass the fetched data down to your Client Component orchestrator
    return (
        <SettingsPage divisions={divisionsData} departments={departmentsData} positions={positionsData} />
    );
}