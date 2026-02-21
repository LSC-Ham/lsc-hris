"use client";

import { useState } from "react";
import { EmploymentDetails } from "@/components/hris/profile/EmploymentDetails";
import { PersonalInformation } from "@/components/hris/profile/PersonalInformation";
import { Address } from "@/components/hris/profile/Address";
import { FamilyBackground } from "@/components/hris/profile/FamilyBackground";
import { EducationalBackground } from "@/components/hris/profile/EducationalBackground";
import { Eligibility } from "@/components/hris/profile/Eligibility";
import { WorkExperience } from "@/components/hris/profile/WorkExperience";

// Import ALL update actions here
import {
    updateAddress, updateEducationalBackground, updateEligibility,
    updateFamilyBackground, updatePersonalInformation, updateWorkExperience
} from "@/actions/employees/update";
import ProfilePictureUpload from "./ProfilePictureUpload";

interface ProfilePageProps {
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
    id: "", profile_picture: ""
}

const DEFAULT_PERSONAL_DATA = {
    surname: "", firstname: "", middlename: "", extension: "", birthdate: "",
    birthplace: "", sex: "", civil_status: "", telephone_no: "", mobile_no: "",
    email: "", nationality: "", height: "", weight: "", blood_type: ""
};

const DEFAULT_EMPLOYMENT_DATA = {
    id_number: "", remarks: "", hired_at: "", division: "", department: "", positions: [], govt_ids: [],
    gsis_no: "", pagibig_no: "", philhealth_no: "", sss_no: "", tin_no: "", agency_no: ""
};

export default function ProfilePage({
    role, user,
    personal_information, employment_details, address, family_background,
    educational_background, eligibility, work_experience,
    departments = [], divisions = [], positions = []
}: ProfilePageProps) {

    const [activeTab, setActiveTab] = useState("Employment Details");

    // --- 1. STATES ---
    const [educationData, setEducationData] = useState(Array.isArray(educational_background) ? educational_background : []);
    const [eligibilityData, setEligibilityData] = useState(Array.isArray(eligibility) ? eligibility : []);
    const [workExperienceData, setWorkExperienceData] = useState(Array.isArray(work_experience) ? work_experience : []);


    const [userData, setUserData] = useState({ ...DEFAULT_USER_DATA, ...(user || {}) });
    const [personalData, setPersonalData] = useState({ ...DEFAULT_PERSONAL_DATA, ...(personal_information || {}) });
    const [employmentData] = useState({ ...DEFAULT_EMPLOYMENT_DATA, ...(employment_details || {}) });

    // CLEANUP: Extract helpers to build the complex state objects cleanly
    const buildAddressState = () => {
        const addrArray = address?.address || [];
        const getAddr = (type: string) => addrArray.find((a: any) => a.address_type === type) || {};

        // We only call getAddr once per type now!
        const res = getAddr("residential");
        const perm = getAddr("permanent");

        return {
            residential: { house_no: res.house_no || "", street: res.street || "", subdivision: res.subdivision || "", region: res.region || "", province: res.province || "", city: res.city || "", barangay: res.barangay || "", zip_code: res.zip_code || "" },
            permanent: { house_no: perm.house_no || "", street: perm.street || "", subdivision: perm.subdivision || "", region: perm.region || "", province: perm.province || "", city: perm.city || "", barangay: perm.barangay || "", zip_code: perm.zip_code || "" }
        };
    };

    const buildFamilyState = () => {
        const famArray = family_background?.family_background || (Array.isArray(family_background) ? family_background : []);
        const getFam = (type: string) => famArray.find((f: any) => f.relation_type?.toLowerCase() === type.toLowerCase()) || {};

        const g = getFam("guardian");
        const f = getFam("father");
        const m = getFam("mother");

        const mapPerson = (person: any) => ({
            surname: person.surname || "", firstname: person.firstname || "", middlename: person.middlename || "",
            extension: person.extension || "", occupation: person.occupation || "", employer: person.employer || "",
            occupation_address: person.occupation_address || "", contact_no: person.contact_no || ""
        });

        return { guardian: mapPerson(g), father: mapPerson(f), mother: mapPerson(m) };
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

    const handleSavePersonalInfo = (data: any) => handleAction(updatePersonalInformation, (d: any) => setPersonalData((prev: any) => ({ ...prev, ...d })), data, "Personal Information updated successfully!");
    const handleSaveAddress = (data: any) => handleAction(updateAddress, setAddressData, data, "Address updated successfully!");
    const handleSaveFamily = (data: any) => handleAction(updateFamilyBackground, setFamilyData, data, "Family background updated successfully!");
    const handleSaveEducation = (data: any[]) => handleAction(updateEducationalBackground, setEducationData, data, "Educational background updated successfully!");
    const handleSaveEligibility = (data: any[]) => handleAction(updateEligibility, setEligibilityData, data, "Eligibility updated successfully!");
    const handleSaveWorkExp = (data: any[]) => handleAction(updateWorkExperience, setWorkExperienceData, data, "Work Experience updated successfully!");


    // --- 3. DYNAMIC RENDERING LOGIC ---
    const renderContent = () => {
        const isMod = role === "moderator";
        const isUser = role === null;

        switch (activeTab) {
            case "Employment Details":
                return <EmploymentDetails mode={isMod ? "update" : "view"} formData={employmentData} departments={departments} divisions={divisions} availablePositions={positions} />;
            case "Personal Information":
                return <PersonalInformation formData={personalData} onSave={handleSavePersonalInfo} />;
            case "Employee Address":
                return <Address mode={isMod ? "view" : undefined} formData={addressData} onSave={isUser ? handleSaveAddress : undefined} />;
            case "Family Background":
                return <FamilyBackground mode={isMod ? "view" : undefined} formData={familyData} onSave={isUser ? handleSaveFamily : undefined} />;
            case "Educational Background":
                return <EducationalBackground mode={isMod ? "view" : undefined} formData={educationData} onSave={isUser ? handleSaveEducation : undefined} />;
            case "Eligibility":
                return <Eligibility mode={isMod ? "view" : undefined} formData={eligibilityData} onSave={isUser ? handleSaveEligibility : undefined} />;
            case "Work Experience":
                return <WorkExperience mode={isMod ? "view" : undefined} formData={workExperienceData} onSave={isUser ? handleSaveWorkExp : undefined} />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                        <h3 className="text-gray-900 font-medium">Coming Soon</h3>
                        <p className="text-gray-500 text-sm mt-1">The {activeTab} form is under construction.</p>
                    </div>
                );
        }
    };

    const menuItems = ["Employment Details", "Personal Information", "Employee Address", "Family Background", "Educational Background", "Eligibility", "Work Experience", "Voluntary Works", "Learning & Development", "Other Information", "References"];

    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                    {role === null ? "My Profile" : "Employee Profile"}
                </h1>
                <p className="text-sm text-gray-500">
                    {role === null ? "Manage your personal data and employment records." : "View and manage employee records."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* === LEFT COLUMN (Sidebar) === */}
                <div className="md:col-span-4 lg:col-span-3 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                        <ProfilePictureUpload userId={userData.id} initialImage={userData.profile_picture} />
                        <h2 className="text-lg font-bold text-gray-800 capitalize">{personalData.firstname} {personalData.surname}</h2>
                        <p className="text-xs text-gray-500 mb-1">{employmentData.department || "No Department Set"}</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <nav className="hidden md:flex flex-col p-2 space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setActiveTab(item)}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${activeTab === item ? "bg-[#1a6b36] text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
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