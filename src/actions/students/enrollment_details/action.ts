"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function generateStudentID() {
    try {
        const student = await prisma.students.findMany({
            distinct: ['id_number']
        })
        const count = student.length

        const nextId = count + 1;

        return nextId.toString().padStart(4, '0');
    } catch (error) {
        console.error("Error generating ID:", error);
        return "";
    }
}

export async function getStudentDetails(idNumber: string, acadYearId?: string, semesterId?: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const whereClause: any = {
            id_number: idNumber
        };

        if (acadYearId) {
            whereClause.acad_year_id = acadYearId;
        }
        if (semesterId) {
            whereClause.semester_id = semesterId;
        }

        const studentRecord = await prisma.students.findFirst({
            where: whereClause,
            include: {
                acad_years: true,
                semesters: true,
                acad_level: true,
                course: true,
                year: true,
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

            acad_level_id: studentRecord.acad_level_id || "",
            course_id: studentRecord.course_id || "",
            acad_year_id: studentRecord.acad_year_id || "",
            semester_id: studentRecord.semester_id || "",
            sections_id: studentRecord.sections_id || "",
            year_id: studentRecord.year_id || "",
            scholarship_id: studentRecord.scholarship_id || "",

            acad_level: studentRecord.acad_level?.acad_level_name || "",
            course: studentRecord.course?.course_code || "",
            acad_year: studentRecord.acad_years?.acad_year || "",
            semester: studentRecord.semesters?.semester || "",
            section: studentRecord.sections?.section || "",
            year: studentRecord.year?.year || "",
            scholarship: studentRecord.scholarships?.scholarship || "",
        };

    } catch (error) {
        console.error("Error fetching student details:", error);
        return null;
    }
}

export async function updateEnrollmentDetails(studentId: string, formData: any) {
    try {
        if (!studentId) {
            return { error: "Student ID is required." };
        }

        // Helper function: if a field is an empty string, turn it into null for Prisma
        const cleanId = (value: string) => (value && value.trim() !== "" ? value : null);

        // Update the student record in the database
        await prisma.students.update({
            where: {
                id: studentId
            },
            data: {
                acad_year_id: cleanId(formData.acad_year_id),
                semester_id: cleanId(formData.semester_id),
                acad_level_id: cleanId(formData.acad_level_id),
                course_id: cleanId(formData.course_id),
                year_id: cleanId(formData.year_id),
                sections_id: cleanId(formData.sections_id),
                scholarship_id: cleanId(formData.scholarship_id),
            }
        });

        // Refresh the page data to show the new changes
        revalidatePath(`/sms/admission/student/${studentId}`);

        return { success: true };

    } catch (error) {
        console.error("Update Enrollment Details Error:", error);
        return { error: "Failed to update enrollment details. Please try again." };
    }
}