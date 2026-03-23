import { getDepartments } from "@/actions/admin/settings/departments/action";
import { getDivisions } from "@/actions/admin/settings/divisions/action";
import CreateEmployeePage from "./CreateEmployeePage";
import { getRanks } from "@/actions/admin/settings/ranks/action";

export default async function Page() {
    const [rawDepts, rawDivs, rawRanks] = await Promise.all([
        getDepartments(),
        getDivisions(),
        getRanks(),
    ]);

    const departments = rawDepts?.map((dept) => dept.department) || [];
    const divisions = rawDivs?.map((div) => div.division) || [];
    const ranks = rawRanks?.map((r) => r.rank) || [];

    return (
        <CreateEmployeePage
            initialDepartments={departments}
            initialDivisions={divisions}
            initialRanks={ranks}
        />
    );
}