import { getDepartments } from "@/actions/admin/settings/departments/action";
import { getDivisions } from "@/actions/admin/settings/divisions/action";
import { getPositions } from "@/actions/admin/settings/positions/action";
import CreateEmployeePage from "./CreateEmployeePage"; 

export default async function Page() {
    const [rawDepts, rawDivs, rawPos] = await Promise.all([
        getDepartments(),
        getDivisions(),
        getPositions(),
    ]);

    const departments = rawDepts?.map((dept) => dept.department) || [];
    const divisions = rawDivs?.map((div) => div.division) || [];
    const positions = rawPos?.map((pos) => pos.position) || [];

    return (
        <CreateEmployeePage
            initialDepartments={departments}
            initialDivisions={divisions}
            initialPositions={positions}
        />
    );
}