"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Optional: for redirecting after save
import { EmploymentDetails } from "@/components/profile/EmploymentDetails";
import { PersonalInformation } from "@/components/profile/ProfileInformation";

export default function CreateUserPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. MASTER STATE: Holds data for BOTH components
    const [formData, setFormData] = useState({
        // --- Employment Data ---
        id_number: "",
        division: "",
        department: "",
        positions: [], // Array of objects
        gsis_no: "",
        pagibig_no: "",
        philhealth_no: "",
        sss_no: "",
        tin_no: "",
        agency_no: "",

        // --- Personal Data ---
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

    // 2. SHARED HANDLER: Updates the Master State
    const handleFieldChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // 3. FINAL SUBMISSION
    const handleCreateAccount = async () => {
        // Basic Validation
        if (!formData.id_number || !formData.surname || !formData.firstname) {
            alert("Please fill in the required fields (ID, Surname, First Name).");
            return;
        }

        setIsSubmitting(true);
        console.log("Creating Account with FINAL Data:", formData);

        try {
            // TODO: Call your Supabase/Prisma API here
            // const response = await fetch('/api/employees', { method: 'POST', body: JSON.stringify(formData) });

            // Simulation
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert("Employee Created Successfully!");
        } catch (error) {
            console.error("Error creating employee:", error);
            alert("Failed to create employee.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        Create New Employee
                    </h1>
                    <p className="text-sm text-gray-500">
                        Please provide the basic identity details to initialize the profile.
                    </p>
                </div>

                {/* --- MAIN ACTION BUTTON --- */}
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

            {/* PAGE CONTENT */}
            <div className="flex flex-col gap-6">

                {/* 1. EMPLOYMENT DETAILS */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
                    <EmploymentDetails
                        mode="create"
                        formData={formData}
                        onChange={handleFieldChange}
                    />
                </div>

                {/* 2. PERSONAL INFORMATION */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
                    <PersonalInformation
                        mode="create"
                        formData={formData}
                        onChange={handleFieldChange}
                    />
                </div>
            </div>
        </div>
    );
}