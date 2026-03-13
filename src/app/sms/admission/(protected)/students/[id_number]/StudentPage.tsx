"use client";

import { useState } from "react";
import { PersonalInformation } from "@/components/profile/PersonalInformation";
import { Address } from "@/components/profile/Address";
import { FamilyBackground } from "@/components/profile/FamilyBackground";
import { EducationalBackground } from "@/components/profile/EducationalBackground";

import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";
import { useRouter } from "next/navigation";
import { EnrollmentDetails } from "@/components/profile/students/EnrollmentDetails";
import { updatePersonalInformation } from "@/actions/students/personal_information/actions";
import { updateAddress } from "@/actions/students/address/action";
import { updateFamilyBackground } from "@/actions/students/family_background/action";
import { updateEducationalBackground } from "@/actions/students/educational_background/action";
import { getStudentDetails, updateEnrollmentDetails } from "@/actions/students/enrollment_details/action";

interface StudentPageProps {
    role: null | "moderator";
    user: any;
    personal_information: any;
    student_details: any;
    address: any;
    family_background: any;
    educational_background: any;
    acadYears?: { id: string; name: string }[];
    semesters?: { id: string; name: string }[];
    acadLevel?: { id: string; name: string }[];
    courses?: { id: string; name: string }[];
    years?: { id: string; year: string; acad_level_id: string }[];
    sections?: { id: string; section: string; acad_level_id: string; year_id: string }[];
    scholarships?: { id: string; name: string }[];
}

const DEFAULT_USER_DATA = {
    id: "",
    profile_picture: ""
};

const DEFAULT_PERSONAL_DATA = {
    surname: "", firstname: "", middlename: "", extension: "", birthdate: "",
    birthplace: "", sex: "", civil_status: "", telephone_no: "", mobile_no: "",
    email: "", nationality: "", height: "", weight: "", blood_type: ""
};

const DEFAULT_STUDENT_DATA = {
    id: "",
    id_number: "",
    enrolled_at: "",
    assessed_at: "",
    created_at: "",
    acad_level_id: "",
    course_id: "",
    year_level_id: "",
    scholarship_id: "",
    sections_id: "",
    acad_year_id: "",
    semester_id: "",
};

export default function StudentPage({
    role, user, personal_information, student_details, address, family_background, educational_background,
    acadYears = [], semesters = [], acadLevel = [], courses = [], years = [], sections = [], scholarships = []
}: StudentPageProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Enrollment Details");

    const [educationData, setEducationData] = useState(Array.isArray(educational_background) ? educational_background : []);
    const [userData] = useState({ ...DEFAULT_USER_DATA, ...(user || {}) });
    const [personalData, setPersonalData] = useState({ ...DEFAULT_PERSONAL_DATA, ...(personal_information || {}) });

    const [studentData, setStudentData] = useState({ ...DEFAULT_STUDENT_DATA, ...(student_details || {}) });

    const buildAddressState = () => {
        const addrArray = address?.address || [];
        const getAddr = (type: string) => addrArray.find((a: any) => a.address_type === type) || {};

        const res = getAddr("residential");
        const perm = getAddr("permanent");

        return {
            residential: {
                house_no: res.house_no || "", street: res.street || "", subdivision: res.subdivision || "",
                region: res.region || "", province: res.province || "", city: res.city || "",
                barangay: res.barangay || "", zip_code: res.zip_code || ""
            },
            permanent: {
                house_no: perm.house_no || "", street: perm.street || "", subdivision: perm.subdivision || "",
                region: perm.region || "", province: perm.province || "", city: perm.city || "",
                barangay: perm.barangay || "", zip_code: perm.zip_code || ""
            }
        };
    };

    const buildFamilyState = () => {
        const famArray = family_background?.family_background || (Array.isArray(family_background) ? family_background : []);
        const getFam = (type: string) => famArray.find((f: any) => f.relation_type?.toLowerCase() === type.toLowerCase()) || {};

        const mapPerson = (person: any) => ({
            surname: person.surname || "", firstname: person.firstname || "", middlename: person.middlename || "",
            extension: person.extension || "", occupation: person.occupation || "", employer: person.employer || "",
            occupation_address: person.occupation_address || "", contact_no: person.contact_no || ""
        });

        return {
            guardian: mapPerson(getFam("guardian")),
            father: mapPerson(getFam("father")),
            mother: mapPerson(getFam("mother"))
        };
    };

    const [addressData, setAddressData] = useState(buildAddressState());
    const [familyData, setFamilyData] = useState(buildFamilyState());

    const handleAction = async (actionFn: Function, stateSetter: Function, data: any, successMsg: string) => {
        try {
            stateSetter(data);
            const result = await actionFn(data);
            if (result.success) alert(successMsg);
            else alert("Error: " + result.error);
        } catch (error) {
            console.error(`Failed to save ${successMsg}:`, error);
            alert("An unexpected error occurred.");
        }
    };

    const handleSavePersonalInfo = (data: any) => {
        handleAction(updatePersonalInformation, (d: any) => setPersonalData((prev: any) => ({ ...prev, ...d })), data, "Personal Information updated successfully!");
    };

    const handleSaveAddress = (data: any) => {
        handleAction(
            (d: any) => updateAddress({ ...d, id_number: studentData.id_number }),
            setAddressData, data, "Address updated successfully!"
        );
    };

    const handleSaveFamily = (data: any) => {
        handleAction(
            (d: any) => updateFamilyBackground({ ...d, id_number: studentData.id_number }),
            setFamilyData, data, "Family background updated successfully!"
        );
    };

    const handleSaveEducation = (data: any) => {
        handleAction(
            (formData: any[]) => updateEducationalBackground({ id_number: studentData.id_number, records: formData }),
            setEducationData, data, "Educational background updated successfully!"
        );
    };

    const handleSaveEnrollmentDetails = (data: any) => {
        handleAction(
            (formData: any) => updateEnrollmentDetails(formData.id, formData),
            (d: any) => setStudentData((prev: any) => ({ ...prev, ...d })),
            data,
            "Enrollment details updated successfully!"
        );
    };

    const handleEnrollmentFilterChange = async (filters: { acad_year_id: string; semester_id: string }) => {
        try {
            const newData = await getStudentDetails(studentData.id_number, filters.acad_year_id, filters.semester_id);

            if (newData) {
                setStudentData((prev: any) => ({
                    ...prev,
                    ...newData
                }));
            } else {
                setStudentData((prev: any) => ({
                    ...DEFAULT_STUDENT_DATA,
                    id: "",
                    id_number: prev.id_number,
                    biography_id: prev.biography_id,
                    acad_year_id: filters.acad_year_id,
                    semester_id: filters.semester_id,
                }));
            }
        } catch (error) {
            console.error("Failed to fetch filtered enrollment data:", error);
            alert("Failed to load term data.");
        }
    };

    const renderContent = () => {
        const isMod = role === "moderator";

        switch (activeTab) {
            case "Enrollment Details":
                return (
                    <EnrollmentDetails
                        mode={isMod ? "update" : "view"}
                        formData={studentData}
                        onSave={handleSaveEnrollmentDetails}
                        onFilterChange={handleEnrollmentFilterChange}
                        acadYears={acadYears}
                        semesters={semesters}
                        acadLevel={acadLevel}
                        courses={courses}
                        section={sections}
                        years={years}
                        scholarship={scholarships}
                    />
                );
            case "Personal Information":
                return <PersonalInformation formData={personalData} onSave={handleSavePersonalInfo} />;
            case "Student Address":
                return <Address formData={addressData} onSave={handleSaveAddress} />;
            case "Family Background":
                return <FamilyBackground formData={familyData} onSave={handleSaveFamily} />;
            case "Educational Background":
                return <EducationalBackground formData={educationData} onSave={handleSaveEducation} />;
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
        "Enrollment Details", "Personal Information", "Student Address", "Family Background", "Educational Background",
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        {role === null ? "My Profile" : "Student Profile"}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {role === null ? "Manage your personal data and student records." : "View and manage student records."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-4 lg:col-span-3 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                        <ProfilePictureUpload userId={userData.id} initialImage={userData.profile_picture} size="lg" />
                        <h2 className="text-lg font-bold text-gray-800 capitalize">
                            {personalData.firstname} {personalData.surname}
                        </h2>
                        <p className="text-xs text-gray-500 mb-1">
                            {studentData.course_id ? "Enrolled Student" : "No Enrollment Data"}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden md:p-0">
                        <div className="md:hidden">
                            <select
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value)}
                                className="block w-full rounded-lg border-gray-200 bg-gray-50 py-3 pl-4 pr-10 text-sm font-medium text-gray-700 focus:border-[#1a6b36] focus:outline-none focus:ring-1 focus:ring-[#1a6b36]"
                            >
                                {menuItems.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </div>
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

                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}