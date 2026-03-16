// src/app/hris/(protected)/(moderator)/settings/page.tsx

import { getDepartments } from "@/actions/admin/settings/departments/action";
import { getDivisions } from "@/actions/admin/settings/divisions/action";
import { getPositions } from "@/actions/admin/settings/positions/action";
import SettingsPage from "@/components/hris/settings/SettingsPage";


export default async function Page() {
    const divisionsData = await getDivisions();
    const departmentsData = await getDepartments();
    const positionsData = await getPositions();

    return (
        <SettingsPage divisions={divisionsData} departments={departmentsData} positions={positionsData} />
    );
}