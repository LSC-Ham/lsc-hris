// src/app/sms/admission/(protected)/students/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EnrollmentDetails } from "@/components/profile/students/EnrollmentDetails";
import { PersonalInformation } from "@/components/profile/PersonalInformation";

import { generateStudentID } from "@/actions/students/enrollment_details/action";
import { createStudent } from "@/actions/students/users/action";
import { getAcadYears } from "@/actions/admin/settings/sms/acad_years/action";
import { getSemesters } from "@/actions/admin/settings/sms/semesters/action";
import { getAcadLevel } from "@/actions/admin/settings/sms/acad_level/action";
import { getCourses } from "@/actions/admin/settings/sms/courses/action";
import { getYears } from "@/actions/admin/settings/sms/years/action";
import { getSections } from "@/actions/admin/settings/sms/sections/action";
import { getScholarships } from "@/actions/admin/settings/scholarship/action";

export default function CreateStudentPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [acadYears, setAcadYears] = useState<{ id: string; name: string; }[]>([]);
    const [semesters, setSemesters] = useState<{ id: string; name: string; }[]>([]);
    const [acadLevel, setAcadLevel] = useState<{ id: string; name: string; }[]>([]);
    const [courses, setCourses] = useState<{ id: string; name: string; }[]>([]);
    const [years, setYears] = useState<{ id: string; year: string; acad_level_id: string; }[]>([]);
    const [sections, setSections] = useState<{ id: string; section: string; acad_level_id: string; year_id: string }[]>([]);
    const [scholarships, setScholarships] = useState<{ id: string; name: string; }[]>([]);

    const [formData, setFormData] = useState({
        id_number: "",
        acad_year_id: "",
        semester_id: "",
        acad_level_id: "",
        course_id: "",
        year_level_id: "",
        sections_id: "",
        scholarship_id: "",

        firstname: "",
        surname: "",
        middlename: "",
        extension: "",
        birthdate: "",
        birthplace: "",
        sex: "",
        civil_status: "",
        telephone_no: "",
        mobile_no: "",
        email: "",
        nationality: "",
        height: "",
        weight: "",
        blood_type: "",
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const autoId = await generateStudentID();
                if (autoId) {
                    setFormData(prev => ({ ...prev, id_number: autoId }));
                }
            } catch (error) {
                console.error("Failed to generate Student ID:", error);
            }

            try {
                const [
                    rawAcadYears,
                    rawSemesters,
                    rawAcadLevels,
                    rawCourses,
                    rawYears,
                    rawSections,
                    rawScholarships
                ] = await Promise.all([
                    getAcadYears(),
                    getSemesters(),
                    getAcadLevel(),
                    getCourses(),
                    getYears(),
                    getSections(),
                    getScholarships()
                ]);

                setAcadYears(rawAcadYears.map((y: any) => ({ id: y.id, name: y.acad_year || "" })));
                setSemesters(rawSemesters.map((s: any) => ({ id: s.id, name: s.semester || "" })));
                setAcadLevel(rawAcadLevels.map((l: any) => ({ id: l.id, name: l.acad_level_name || "" })));
                setCourses(rawCourses.map((c: any) => ({ id: c.id, name: c.course_code || "" })));
                setYears(rawYears.map((y: any) => ({ id: y.id, year: y.year || "", acad_level_id: y.acad_level_id || "" })));
                setSections(rawSections.map((s: any) => ({ id: s.id, section: s.section || "", acad_level_id: s.acad_level_id || "", year_id: s.year_id })));
                setScholarships(rawScholarships.map((s: any) => ({ id: s.id, name: s.scholarship || "" })));

            } catch (error) {
                console.error("Failed to load dropdown options:", error);
            }
        };

        loadInitialData();
    }, []);

    const handleFormUpdate = (newData: any) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const handleCreateAccount = async () => {
        if (!formData.id_number || !formData.surname || !formData.firstname || !formData.acad_level_id) {
            alert("Please fill in the required fields (ID, Surname, First Name, Academic Level).");
            return;
        }

        setIsSubmitting(true);
        console.log("Creating Student Account with FINAL Data:", formData);

        try {
            const result = await createStudent(formData);

            if (result?.error) {
                alert(result.error);
            } else {
                alert("Student Created Successfully!");
                router.push("./students");
            }
        } catch (error) {
            console.error("Error creating student:", error);
            alert("Failed to create student.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        Create New Student
                    </h1>
                    <p className="text-sm text-gray-500">
                        Please provide the basic identity and enrollment details to initialize the profile.
                    </p>
                </div>

                <button
                    onClick={handleCreateAccount}
                    disabled={isSubmitting}
                    className="bg-[#1a6b36] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#155a2b] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                    {isSubmitting ? (
                        <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            Creating...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </div>

            <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
                    <EnrollmentDetails
                        mode="create"
                        formData={formData}
                        onChange={handleFormUpdate}
                        onFilterChange={(filters) => handleFormUpdate(filters)}
                        acadYears={acadYears}
                        semesters={semesters}
                        acadLevel={acadLevel}
                        courses={courses}
                        years={years}
                        section={sections}
                        scholarship={scholarships}
                    />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
                    <PersonalInformation
                        mode="create"
                        formData={formData}
                        onChange={handleFormUpdate}
                    />
                </div>
            </div>
        </div>
    );
}