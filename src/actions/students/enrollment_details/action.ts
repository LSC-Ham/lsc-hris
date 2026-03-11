"use server";

import { prisma } from "@/lib/prisma"; // Adjust path if needed
import { authOptions } from "@/lib/auth"; // Adjust path if needed
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function generateStudentID() {
    try {
        const count = await prisma.students.count();

        const nextId = count + 1;

        return nextId.toString().padStart(4, '0');
    } catch (error) {
        console.error("Error generating ID:", error);
        return "";
    }
}

export async function getStudentDetails(studentId: string, acadYear?: string, semester?: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const whereClause: any = {
            id: studentId
        };

        if (acadYear) {
            whereClause.acad_years = { acad_year: acadYear };
        }
        if (semester) {
            whereClause.semesters = { semester: semester };
        }

        const studentRecord = await prisma.students.findFirst({
            where: whereClause,
            include: {
                acad_years: true,
                semesters: true,
                acad_level: true,
                course: true,
                year_level: true,
                sections: true,
                scholarships: true,
            },
            orderBy: {
                created_at: "desc"
            }
        });

        if (!studentRecord) return null;

        return {
            id: studentRecord.id,
            id_number: studentRecord.id_number || "",
            enrolled_at: studentRecord.enrolled_at || "",
            created_at: studentRecord.created_at || "",
            acad_level: studentRecord.acad_level?.acad_level_name || "",
            course: studentRecord.course?.course_code || "",
            acad_year: studentRecord.acad_years?.acad_year || "",
            semester: studentRecord.semesters?.semester || "",
            section: studentRecord.sections?.section || "",
            year: studentRecord.year_level?.year || "",
            scholarship: studentRecord.scholarships?.scholarship || "",
        };

    } catch (error) {
        console.error("Error fetching student details:", error);
        return null;
    }
}

export async function updateEnrollmentDetails(studentId: string, formData: any) {
    try {

        // Revalidate the cache so the UI updates immediately
        revalidatePath(`/sms/admission/student/${studentId}`);
        return { success: true };

    } catch (error) {
        console.error("Update Error:", error);
        return { error: "Failed to update employment details." };
    }
}