"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function generateEmployeeID(division: string) {
    try {
        const count = await prisma.employees.count();
        const nextId = count + 1;
        return division.substring(0, 2).toLowerCase() + nextId.toString().padStart(4, '0');
    } catch (error) {
        console.error("Error generating ID:", error);
        return "";
    }
}

export async function getEmployeeDetails(employeeId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const employee = await prisma.employees.findUnique({
            where: { id: employeeId },
            include: {
                // REMOVED: include: { positions: true } 
                // We just need to order the records now.
                positions: { orderBy: { start_at: 'desc' } },
                government_ids: true,
                divisions: true,
                departments: true,
                ranks: true,
            }
        });

        if (!employee) return null;

        const govIdKeys: Record<string, string> = {
            "GSIS No.": "gsis_no", "Pag-IBIG No.": "pagibig_no",
            "PhilHealth No.": "philhealth_no", "SSS No.": "sss_no",
            "TIN No.": "tin_no", "Agency No.": "agency_no"
        };

        const flatGovIds = employee.government_ids.reduce((acc: any, curr) => {
            const key = govIdKeys[curr.id_label];
            if (key) acc[key] = curr.id_number;
            return acc;
        }, {});

        return {
            id: employee.id,
            id_number: employee.id_number,
            remarks: employee.remarks,
            hired_at: employee.hired_at,
            division: employee.divisions?.division || "",
            department: employee.departments?.department || "",
            rank: employee.ranks?.rank || "",
            govt_ids: employee.government_ids,
            ...flatGovIds,

            // UPDATED: Simply map the 'positions' string field 
            // We map it to 'position' to keep your frontend working without changes
            positions: employee.positions.map((record) => ({
                ...record,
                position: record.positions,
            })),
        };

    } catch (error) {
        console.error("Error fetching employment details:", error);
        return null;
    }
}

export async function updateEmploymentDetails(employeeId: string, formData: any) {
    try {
        const division = await prisma.divisions.findFirst({
            where: { division: formData.division },
        });

        const department = await prisma.departments.findFirst({
            where: { department: formData.department },
        });

        const rank = await prisma.ranks.findFirst({
            where: { rank: formData.rank },
        });

        if (!division) {
            return { error: "Invalid Division selected." }; // Fixed small typo here!
        }

        if (!department) {
            return { error: "Invalid Department selected." };
        }

        if (!rank) {
            return { error: "Invalid Rank selected." };
        }

        // REMOVED: The block of code querying prisma.positions.findMany
        // We no longer need to look up IDs. We just map the data directly!

        const positionInserts = (formData.positions || [])
            .map((p: any) => {
                if (!p.position) return null; // Make sure the position string exists

                return {
                    employees_id: employeeId,
                    positions: p.position, // UPDATED: directly insert the string
                    status: p.status,
                    description: p.description,
                    is_active: Boolean(p.is_active),
                    start_at: p.start_at ? new Date(p.start_at) : null,
                    end_at: p.end_at ? new Date(p.end_at) : null,
                };
            })
            .filter(Boolean);

        const govIdInserts: any[] = [];

        if (formData.gsis_no) govIdInserts.push({ employees_id: employeeId, id_label: "GSIS No.", id_number: formData.gsis_no });
        if (formData.pagibig_no) govIdInserts.push({ employees_id: employeeId, id_label: "Pag-IBIG No.", id_number: formData.pagibig_no });
        if (formData.philhealth_no) govIdInserts.push({ employees_id: employeeId, id_label: "PhilHealth No.", id_number: formData.philhealth_no });
        if (formData.sss_no) govIdInserts.push({ employees_id: employeeId, id_label: "SSS No.", id_number: formData.sss_no });
        if (formData.tin_no) govIdInserts.push({ employees_id: employeeId, id_label: "TIN No.", id_number: formData.tin_no });
        if (formData.agency_no) govIdInserts.push({ employees_id: employeeId, id_label: "Agency No.", id_number: formData.agency_no });

        await prisma.$transaction(async (tx) => {

            await tx.employees.update({
                where: { id: employeeId },
                data: {
                    hired_at: formData.hired_at ? new Date(formData.hired_at) : null,
                    remarks: formData.remarks ? formData.remarks : null,
                    divisions_id: division.id,
                    departments_id: department.id,
                    ranks_id: rank.id,
                },
            });

            await tx.employees_positions.deleteMany({
                where: { employees_id: employeeId },
            });

            if (positionInserts.length > 0) {
                await tx.employees_positions.createMany({
                    data: positionInserts,
                });
            }

            await tx.employees_govIDs.deleteMany({
                where: { employees_id: employeeId },
            });

            if (govIdInserts.length > 0) {
                await tx.employees_govIDs.createMany({
                    data: govIdInserts,
                });
            }
        });

        revalidatePath(`/employees/${employeeId}`);
        return { success: true };

    } catch (error) {
        console.error("Update Error:", error);
        return { error: "Failed to update employment details." };
    }
}

export async function setDepartmentRole(id_number: string, newRole: string, departmentName: string) {
    try {
        // Optional but recommended: If you are setting a new "Head", 
        // you might want to remove the "Head" role from anyone else in this department first!
        if (newRole === 'Head') {
            await prisma.employees.updateMany({
                where: {
                    departments: { department: departmentName },
                    department_role: 'Head'
                },
                data: { department_role: null }
            });
        }

        if (newRole === 'Assistant Head') {
            await prisma.employees.updateMany({
                where: {
                    departments: { department: departmentName },
                    department_role: 'Assistant Head'
                },
                data: { department_role: null }
            });
        }

        // Now, update the actual employee that was clicked
        await prisma.employees.update({
            where: { id_number: id_number },
            data: { department_role: newRole }
        });

        // This tells Next.js to instantly refresh the page data so the UI updates
        revalidatePath(`/hris/departments/${departmentName}`);

        return { success: true };
    } catch (error) {
        console.error("Error setting role:", error);
        return { success: false, error: "Failed to update role" };
    }
}