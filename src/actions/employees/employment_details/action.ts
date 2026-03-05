"use server";

import { prisma } from "@/lib/prisma"; // Adjust path if needed
import { authOptions } from "@/lib/auth"; // Adjust path if needed
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function generateEmployeeID() {
    try {
        const count = await prisma.employees.count();

        const nextId = count + 1;

        return nextId.toString().padStart(4, '0');
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
                positions: { include: { positions: true }, orderBy: { start_at: 'desc' } },
                government_ids: true,
                divisions: true,
                departments: true
            }
        });

        if (!employee) return null;

        // 1. Map standard government ID labels to your frontend snake_case keys
        const govIdKeys: Record<string, string> = {
            "GSIS No.": "gsis_no", "Pag-IBIG No.": "pagibig_no",
            "PhilHealth No.": "philhealth_no", "SSS No.": "sss_no",
            "TIN No.": "tin_no", "Agency No.": "agency_no"
        };

        // 2. Transform the array of IDs into a flat object (e.g., { gsis_no: "123", tin_no: "456" })
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
            govt_ids: employee.government_ids,
            ...flatGovIds, // <--- Spreads gsis_no, tin_no, etc., directly into the return object!

            // 3. Flatten the positions array using the spread operator
            positions: employee.positions.map(({ positions, ...record }) => ({
                ...record, // Grabs status, description, start_at, end_at, etc.
                position_id: positions.id,
                position: positions.position,
            })),
        };

    } catch (error) {
        console.error("Error fetching employment details:", error);
        return null;
    }
}

export async function updateEmploymentDetails(employeeId: string, formData: any) {
    try {
        // 1. Resolve Division & Department Names to IDs
        const division = await prisma.divisions.findFirst({
            where: { division: formData.division },
        });

        const department = await prisma.departments.findFirst({
            where: { department: formData.department },
        });

        if (!division || !department) {
            return { error: "Invalid Division or Department selected." };
        }

        // 2. Resolve Position Names to UUIDs
        const positionNames = formData.positions?.map((p: any) => p.position) || [];

        const foundPositions = await prisma.positions.findMany({
            where: { position: { in: positionNames } },
        });

        const positionMap = new Map(foundPositions.map((p) => [p.position, p.id]));

        // 3. Prepare Position Data for Insert
        const positionInserts = (formData.positions || [])
            .map((p: any) => {
                const posId = positionMap.get(p.position);
                if (!posId) return null;

                return {
                    employees_id: employeeId,
                    positions_id: posId,
                    status: p.status,
                    description: p.description,
                    is_active: Boolean(p.is_active), // <--- ADDED: Save the active state
                    start_at: p.start_at ? new Date(p.start_at) : null,
                    end_at: p.end_at ? new Date(p.end_at) : null,
                };
            })
            .filter(Boolean); // Remove nulls

        // === NEW: 4. Prepare Government IDs for Insert ===
        // We check if the form data actually has a value before adding it to the insert array
        const govIdInserts: any[] = [];

        if (formData.gsis_no) govIdInserts.push({ employees_id: employeeId, id_label: "GSIS No.", id_number: formData.gsis_no });
        if (formData.pagibig_no) govIdInserts.push({ employees_id: employeeId, id_label: "Pag-IBIG No.", id_number: formData.pagibig_no });
        if (formData.philhealth_no) govIdInserts.push({ employees_id: employeeId, id_label: "PhilHealth No.", id_number: formData.philhealth_no });
        if (formData.sss_no) govIdInserts.push({ employees_id: employeeId, id_label: "SSS No.", id_number: formData.sss_no });
        if (formData.tin_no) govIdInserts.push({ employees_id: employeeId, id_label: "TIN No.", id_number: formData.tin_no });
        if (formData.agency_no) govIdInserts.push({ employees_id: employeeId, id_label: "Agency No.", id_number: formData.agency_no });

        // 5. Execute Database Transaction
        await prisma.$transaction(async (tx) => {

            // A. Update Main Employee Details
            await tx.employees.update({
                where: { id: employeeId },
                data: {
                    hired_at: formData.hired_at ? new Date(formData.hired_at) : null,
                    remarks: formData.remarks ? formData.remarks : null,
                    divisions_id: division.id,
                    departments_id: department.id,
                },
            });

            // B. Update Position History (Wipe & Replace)
            await tx.employees_positions.deleteMany({
                where: { employees_id: employeeId },
            });

            if (positionInserts.length > 0) {
                await tx.employees_positions.createMany({
                    data: positionInserts,
                });
            }

            // === NEW: C. Update Government IDs (Wipe & Replace) ===
            await tx.employees_govIDs.deleteMany({
                where: { employees_id: employeeId },
            });

            if (govIdInserts.length > 0) {
                await tx.employees_govIDs.createMany({
                    data: govIdInserts,
                });
            }
        });

        // Revalidate the cache so the UI updates immediately
        revalidatePath(`/employees/${employeeId}`);
        return { success: true };

    } catch (error) {
        console.error("Update Error:", error);
        return { error: "Failed to update employment details." };
    }
}