"use client";

import { useState } from "react";
import { EmploymentDetails } from "@/components/profile/EmploymentDetails";
import { PersonalInformation } from "@/components/profile/PersonalInformation";
import { Address } from "@/components/profile/Address";
import { FamilyBackground } from "@/components/profile/FamilyBackground";
import { EducationalBackground } from "@/components/profile/EducationalBackground";
import { Eligibility } from "@/components/profile/Eligibility";
import { WorkExperience } from "@/components/profile/WorkExperience";

import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";
import { updateEmploymentDetails } from "@/actions/employees/employment_details/action";
import { updatePersonalInformation } from "@/actions/employees/personal_information/actions";
import { updateAddress } from "@/actions/employees/address/action";
import { updateFamilyBackground } from "@/actions/employees/family_background/action";
import { updateEducationalBackground } from "@/actions/employees/educational_background/action";
import { updateEligibility } from "@/actions/employees/eligibility/action";
import { updateWorkExperience } from "@/actions/employees/work_experience/action";
import { deleteEmployee } from "@/actions/employees/action";
import { useRouter } from "next/navigation";

interface EmployeePageProps {
    role: null | "moderator";
    user: any;
    personal_information: any;
    employment_details: any;
    address: any;
    family_background: any;
    educational_background: any;
    eligibility: any;
    work_experience: any;
    departments?: any[];
    divisions?: any[];
    positions?: any[];
}

const DEFAULT_USER_DATA = {
    id: "",
    profile_picture: ""
};

const DEFAULT_PERSONAL_DATA = {
    surname: "",
    firstname: "",
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
    blood_type: ""
};

const DEFAULT_EMPLOYMENT_DATA = {
    id_number: "",
    remarks: "",
    hired_at: "",
    division: "",
    department: "",
    positions: [],
    govt_ids: [],
    gsis_no: "",
    pagibig_no: "",
    philhealth_no: "",
    sss_no: "",
    tin_no: "",
    agency_no: ""
};

export default function EmployeePage({
    role,
    user,
    personal_information,
    employment_details,
    address,
    family_background,
    educational_background,
    eligibility,
    work_experience,
    departments = [],
    divisions = [],
    positions = []
}: EmployeePageProps) {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("Employment Details");

    // --- 1. STATES ---
    const [educationData, setEducationData] = useState(Array.isArray(educational_background) ? educational_background : []);
    const [eligibilityData, setEligibilityData] = useState(Array.isArray(eligibility) ? eligibility : []);
    const [workExperienceData, setWorkExperienceData] = useState(Array.isArray(work_experience) ? work_experience : []);

    const [userData] = useState({ ...DEFAULT_USER_DATA, ...(user || {}) });
    const [personalData, setPersonalData] = useState({ ...DEFAULT_PERSONAL_DATA, ...(personal_information || {}) });
    const [employmentData, setEmploymentData] = useState({ ...DEFAULT_EMPLOYMENT_DATA, ...(employment_details || {}) });

    // CLEANUP: Extract helpers to build the complex state objects cleanly
    const buildAddressState = () => {
        const addrArray = address?.address || [];
        const getAddr = (type: string) => addrArray.find((a: any) => a.address_type === type) || {};

        // We only call getAddr once per type now!
        const res = getAddr("residential");
        const perm = getAddr("permanent");

        return {
            residential: {
                house_no: res.house_no || "",
                street: res.street || "",
                subdivision: res.subdivision || "",
                region: res.region || "",
                province: res.province || "",
                city: res.city || "",
                barangay: res.barangay || "",
                zip_code: res.zip_code || ""
            },
            permanent: {
                house_no: perm.house_no || "",
                street: perm.street || "",
                subdivision: perm.subdivision || "",
                region: perm.region || "",
                province: perm.province || "",
                city: perm.city || "",
                barangay: perm.barangay || "",
                zip_code: perm.zip_code || ""
            }
        };
    };

    const buildFamilyState = () => {
        const famArray = family_background?.family_background || (Array.isArray(family_background) ? family_background : []);
        const getFam = (type: string) => famArray.find((f: any) => f.relation_type?.toLowerCase() === type.toLowerCase()) || {};

        const g = getFam("guardian");
        const f = getFam("father");
        const m = getFam("mother");

        const mapPerson = (person: any) => ({
            surname: person.surname || "",
            firstname: person.firstname || "",
            middlename: person.middlename || "",
            extension: person.extension || "",
            occupation: person.occupation || "",
            employer: person.employer || "",
            occupation_address: person.occupation_address || "",
            contact_no: person.contact_no || ""
        });

        return {
            guardian: mapPerson(g),
            father: mapPerson(f),
            mother: mapPerson(m)
        };
    };

    const [addressData, setAddressData] = useState(buildAddressState());
    const [familyData, setFamilyData] = useState(buildFamilyState());

    // --- 2. HANDLERS ---
    // CLEANUP: Use a generic helper to reduce the repetitive try/catch blocks
    const handleAction = async (actionFn: Function, stateSetter: Function, data: any, successMsg: string) => {
        try {
            stateSetter(data); // Optimistic UI update
            const result = await actionFn(data);
            if (result.success) alert(successMsg);
            else alert("Error: " + result.error);
        } catch (error) {
            console.error(`Failed to save ${successMsg}:`, error);
            alert("An unexpected error occurred.");
        }
    };

    const handleSavePersonalInfo = (data: any) => {
        handleAction(
            updatePersonalInformation,
            (d: any) => setPersonalData((prev: any) => ({ ...prev, ...d })),
            data,
            "Personal Information updated successfully!"
        );
    };

    const handleSaveAddress = (data: any) => {
        handleAction(
            (d: any) => {
                const payload = { ...d, id_number: employmentData.id_number };
                return updateAddress(payload);
            },
            setAddressData,
            data,
            "Address updated successfully!"
        );
    };

    const handleSaveFamily = (data: any) => {
        handleAction(
            (d: any) => {
                const payload = { ...d, id_number: employmentData.id_number };
                return updateFamilyBackground(payload);
            },
            setFamilyData,
            data,
            "Family background updated successfully!"
        );
    };

    const handleSaveEducation = (data: any) => {
        handleAction(
            (formData: any[]) => {
                const payload = {
                    id_number: employmentData.id_number,
                    records: formData
                };
                return updateEducationalBackground(payload);
            },
            setEducationData,
            data,
            "Educational background updated successfully!"
        );
    };

    const handleSaveEligibility = (data: any) => {
        handleAction(
            (formData: any[]) => {
                const payload = {
                    id_number: employmentData.id_number,
                    records: formData
                };
                return updateEligibility(payload);
            },
            setEligibilityData,
            data,
            "Eligibility updated successfully!"
        );
    };

    const handleSaveWorkExp = (data: any) => {
        handleAction(
            (formData: any[]) => {
                const payload = {
                    id_number: employmentData.id_number,
                    records: formData
                };
                return updateWorkExperience(payload);
            },
            setWorkExperienceData,
            data,
            "Work Experience updated successfully!"
        );
    };

    const handleSaveEmploymentDetails = (data: any) => {
        handleAction(
            // 1. Extract the ID from the data and pass it as the first argument
            // 2. Pass the rest of the form data as the second argument
            (formData: any) => updateEmploymentDetails(formData.id, formData),
            (d: any) => setEmploymentData((prev: any) => ({ ...prev, ...d })),
            data,
            "Employment details updated successfully!"
        );
    };

    // --- 3. DYNAMIC RENDERING LOGIC ---
    const renderContent = () => {
        const isMod = role === "moderator";
        const isUser = role === null;

        switch (activeTab) {
            case "Employment Details":
                return (
                    <EmploymentDetails
                        mode={isMod ? "update" : "view"}
                        formData={employmentData}
                        onSave={handleSaveEmploymentDetails}
                        departments={departments}
                        divisions={divisions}
                        availablePositions={positions}
                    />
                );
            case "Personal Information":
                return (
                    <PersonalInformation
                        formData={personalData}
                        onSave={handleSavePersonalInfo}
                    />
                );
            case "Employee Address":
                return (
                    <Address
                        mode={isMod ? "view" : undefined}
                        formData={addressData}
                        onSave={isUser ? handleSaveAddress : undefined}
                    />
                );
            case "Family Background":
                return (
                    <FamilyBackground
                        mode={isMod ? "view" : undefined}
                        formData={familyData}
                        onSave={isUser ? handleSaveFamily : undefined}
                    />
                );
            case "Educational Background":
                return (
                    <EducationalBackground
                        mode={isMod ? "view" : undefined}
                        formData={educationData}
                        onSave={isUser ? handleSaveEducation : undefined}
                    />
                );
            case "Eligibility":
                return (
                    <Eligibility
                        mode={isMod ? "view" : undefined}
                        formData={eligibilityData}
                        onSave={isUser ? handleSaveEligibility : undefined}
                    />
                );
            case "Work Experience":
                return (
                    <WorkExperience
                        mode={isMod ? "view" : undefined}
                        formData={workExperienceData}
                        onSave={isUser ? handleSaveWorkExp : undefined}
                    />
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                        <h3 className="text-gray-900 font-medium">Coming Soon</h3>
                        <p className="text-gray-500 text-sm mt-1">The {activeTab} form is under construction.</p>
                    </div>
                );
        }
    };

    const menuItems = [
        "Employment Details",
        "Personal Information",
        "Employee Address",
        "Family Background",
        "Educational Background",
        "Eligibility",
        "Work Experience",
        "Voluntary Works",
        "Learning & Development",
        "Other Information",
        "References"
    ];

    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        {role === null ? "My Profile" : "Employee Profile"}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {role === null ? "Manage your personal data and employment records." : "View and manage employee records."}
                    </p>
                </div>
                {role === "moderator" && (
                    <button
                        onClick={async () => {
                            if (!window.confirm("Are you sure you want to delete this employee's profile? This action cannot be undone.")) return;

                            try {
                                const result = await deleteEmployee(employmentData.id_number);

                                if (result.success) {
                                    alert("Employee profile deleted successfully!");
                                    router.push("/hris/employees");
                                } else {
                                    alert("Error: " + result.error);
                                }
                            } catch (error) {
                                console.error("Delete Error:", error);
                                alert("An unexpected error occurred while deleting.");
                            }
                        }}
                        className="bg-[#1a6b36] hover:bg-[#155a2b] text-white px-4 py-2 rounded-lg text-sm"
                    >
                        Delete Employee
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* === LEFT COLUMN (Sidebar) === */}
                <div className="md:col-span-4 lg:col-span-3 space-y-6">
                    {/* Profile Picture & Name Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                        <ProfilePictureUpload
                            userId={userData.id}
                            initialImage={userData.profile_picture}
                            size="lg"
                        />
                        <h2 className="text-lg font-bold text-gray-800 capitalize">
                            {personalData.firstname} {personalData.surname}
                        </h2>
                        <p className="text-xs text-gray-500 mb-1">
                            {employmentData.department || "No Department Set"}
                        </p>
                    </div>

                    {/* Navigation Menu */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden md:p-0">

                        {/* 📱 MOBILE DROPDOWN (Visible only on small screens) */}
                        <div className="md:hidden">
                            <select
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value)}
                                className="block w-full rounded-lg border-gray-200 bg-gray-50 py-3 pl-4 pr-10 text-sm font-medium text-gray-700 focus:border-[#1a6b36] focus:outline-none focus:ring-1 focus:ring-[#1a6b36]"
                            >
                                {menuItems.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 💻 DESKTOP SIDEBAR (Visible only on medium screens and up) */}
                        <nav className="hidden md:flex flex-col p-2 space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setActiveTab(item)}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${activeTab === item
                                        ? "bg-[#1a6b36] text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>

                    </div>
                </div>

                {/* === RIGHT COLUMN (Dynamic Content) === */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}