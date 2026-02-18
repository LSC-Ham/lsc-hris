"use client";

import { useState, useEffect } from "react"; // 1. Import useEffect
import { EmploymentDetails } from "@/components/profile/EmploymentDetails";
import { PersonalInformation } from "@/components/profile/PersonalInformation";

// 2. Import the Server Action we just created
import { generateEmployeeID } from "@/actions/employees/get";

export default function CreateUserPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        id_number: "",
        division: "",
        department: "",
        positions: [],
        gsis_no: "",
        pagibig_no: "",
        philhealth_no: "",
        sss_no: "",
        tin_no: "",
        agency_no: "",

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
        const fetchAutoId = async () => {
            const autoId = await generateEmployeeID();
            if (autoId) {
                setFormData(prev => ({ ...prev, id_number: autoId }));
            }
        };

        fetchAutoId();
    }, []);
    const handleFieldChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreateAccount = async () => {
        if (!formData.id_number || !formData.surname || !formData.firstname) {
            alert("Please fill in the required fields (ID, Surname, First Name).");
            return;
        }

        setIsSubmitting(true);
        console.log("Creating Account with FINAL Data:", formData);

        try {
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        Create New Employee
                    </h1>
                    <p className="text-sm text-gray-500">
                        Please provide the basic identity details to initialize the profile.
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
                    <EmploymentDetails
                        mode="create"
                        formData={formData}
                        onChange={handleFieldChange}
                    />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
                    <PersonalInformation
                        mode="create"
                        formData={formData}
                    />
                </div>
            </div>
        </div>
    );
}