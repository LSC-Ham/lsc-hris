"use server";

// Remove these if you aren't actually using them in this file
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth"; 

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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