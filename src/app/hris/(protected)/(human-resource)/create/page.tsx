"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EmploymentDetails } from "@/components/profile/EmploymentDetails";
import { PersonalInformation } from "@/components/profile/PersonalInformation";

import { getDepartments } from "@/actions/admin/settings/departments/action";
import { getDivisions } from "@/actions/admin/settings/divisions/action";
import { getPositions } from "@/actions/admin/settings/positions/action";
import { generateEmployeeID } from "@/actions/employees/employment_details/action";
import { createEmployee } from "@/actions/employees/users/action";

import { toast } from "sonner";

import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function Page() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [departments, setDepartments] = useState<string[]>([]);
    const [divisions, setDivisions] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        id_number: "",
        hired_at: new Date(),
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
            try {
                const [fetchedDepts, fetchedDivs, fetchedPos] = await Promise.all([
                    (await getDepartments()).map((dept) => dept.department),
                    (await getDivisions()).map((div) => div.division),
                    (await getPositions()).map((pos) => pos.position),
                ]);

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
        const fetchDynamicId = async () => {
            if (formData.division) {
                const dynamicId = await generateEmployeeID(formData.division);
                if (dynamicId) {
                    setFormData((prev) => ({ ...prev, id_number: dynamicId }));
                }
            } else {
                setFormData((prev) => ({ ...prev, id_number: "" }));
            }
        };

        fetchDynamicId();
    }, [formData.division]);

    const handleFormUpdate = (newData: any) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const handleInitialSubmit = () => {
        if (!formData.id_number || !formData.surname || !formData.firstname) {
            toast.error("Please fill in the required fields (ID, Surname, First Name).");
            return;
        }

        setShowConfirmModal(true);
    };

    const handleConfirmCreate = async () => {
        setIsSubmitting(true);

        try {
            const result = await createEmployee(formData);

            if (result?.error) {
                toast.error(result.error);
                setShowConfirmModal(false);
            } else {
                toast.success("Employee Created Successfully!");
                setShowConfirmModal(false);
                router.push("./employees");
                router.refresh();
            }
        } catch (error) {
            console.error("Error creating employee:", error);
            toast.error("Failed to create employee.");
            setShowConfirmModal(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 pb-12 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        Create New Employee
                    </h1>
                    <p className="text-sm text-gray-500">
                        Please provide the basic identity details to initialize the profile.
                    </p>
                </div>
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

            <button
                onClick={handleInitialSubmit}
                disabled={isSubmitting}
                className="bg-[#1a6b36] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#155a2b] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
                Create Account
            </button>

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmCreate}
                isConfirming={isSubmitting}
                title="Confirm Employee Creation"
                subtitle="Please review before submitting."
                message={
                    <p>
                        Are you sure you want to create a new profile for <strong>{formData.firstname} {formData.surname}</strong>? Verify that the identity details and generated ID (<strong>{formData.id_number}</strong>) are correct.
                    </p>
                }
                confirmText="Yes, Create Profile"
            />
        </div>
    );
}