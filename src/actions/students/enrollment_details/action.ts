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

export async function getStudentDetails(studentId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/login");

        const student = await prisma.students.findUnique({
            where: { id: studentId },
        });

        if (!student) return null;

       

        return {
            id: student.id,
            id_number: student.id_number,
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