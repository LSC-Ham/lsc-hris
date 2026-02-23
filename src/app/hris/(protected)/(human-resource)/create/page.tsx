"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Added router for redirection
import { EmploymentDetails } from "@/components/hris/profile/EmploymentDetails";
import { PersonalInformation } from "@/components/hris/profile/PersonalInformation";

import { generateEmployeeID } from "@/actions/employees/profile/get";
import { createEmployee } from "@/actions/employees/profile/post";
import { getDepartments } from "@/actions/admin/settings/departments/action";
import { getDivisions } from "@/actions/admin/settings/divisions/get";
import { getPositions } from "@/actions/admin/settings/positions/get";

export default function Page() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [departments, setDepartments] = useState<string[]>([]);
    const [divisions, setDivisions] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);

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
        const loadInitialData = async () => {
            // Fetch the ID
            const autoId = await generateEmployeeID();
            if (autoId) {
                setFormData(prev => ({ ...prev, id_number: autoId }));
            }

            // 2. Fetch all dropdown data at the same time
            try {
                const [fetchedDepts, fetchedDivs, fetchedPos] = await Promise.all([
                    getDepartments(),
                    getDivisions(),
                    getPositions()
                ]);

                // Update the state (make sure your getter functions return simple arrays of strings!)
                setDepartments(fetchedDepts || []);
                setDivisions(fetchedDivs || []);
                setPositions(fetchedPos || []);
            } catch (error) {
                console.error("Failed to load dropdown options:", error);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        const fetchAutoId = async () => {
            const autoId = await generateEmployeeID();
            if (autoId) {
                setFormData(prev => ({ ...prev, id_number: autoId }));
            }
        };

        fetchAutoId();
    }, []);

    // Add this helper function to let child components update the form data
    const handleFormUpdate = (newData: any) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const handleCreateAccount = async () => {
        // Basic validation
        if (!formData.id_number || !formData.surname || !formData.firstname) {
            alert("Please fill in the required fields (ID, Surname, First Name).");
            return;
        }

        setIsSubmitting(true);
        console.log("Creating Account with FINAL Data:", formData);

        try {
            // Call your actual server action instead of the timeout
            const result = await createEmployee(formData);

            if (result?.error) {
                alert(result.error);
            } else {
                alert("Employee Created Successfully!");
                router.push("./employees"); // Redirect to employee list or profile
            }
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
                        onChange={handleFormUpdate}
                        divisions={divisions}
                        departments={departments}
                        availablePositions={positions}
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