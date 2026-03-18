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
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

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

interface PendingAction {
    actionFn: Function;
    stateSetter: Function | null;
    data: any;
    successMsg: string;
    actionName: string;
    isDelete?: boolean;
}

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

    const [educationData, setEducationData] = useState(Array.isArray(educational_background) ? educational_background : []);
    const [eligibilityData, setEligibilityData] = useState(Array.isArray(eligibility) ? eligibility : []);
    const [workExperienceData, setWorkExperienceData] = useState(Array.isArray(work_experience) ? work_experience : []);

    const [userData] = useState({ ...DEFAULT_USER_DATA, ...(user || {}) });
    const [personalData, setPersonalData] = useState({ ...DEFAULT_PERSONAL_DATA, ...(personal_information || {}) });
    const [employmentData, setEmploymentData] = useState({ ...DEFAULT_EMPLOYMENT_DATA, ...(employment_details || {}) });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

    const buildAddressState = () => {
        const addrArray = address?.address || [];
        const getAddr = (type: string) => addrArray.find((a: any) => a.address_type === type) || {};

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

    const handleAction = (actionFn: Function, stateSetter: Function, data: any, successMsg: string, actionName: string) => {
        setPendingAction({ actionFn, stateSetter, data, successMsg, actionName });
        setIsModalOpen(true);
    };

    const confirmExecuteAction = async () => {
        if (!pendingAction) return;
        setIsSaving(true);

        try {
            if (pendingAction.isDelete) {
                const result = await pendingAction.actionFn();
                if (result.success) {
                    toast.success(pendingAction.successMsg);
                    router.push("/hris/employees");
                } else {
                    toast.error("Error: " + result.error);
                }
                return;
            }

            if (pendingAction.stateSetter) {
                pendingAction.stateSetter(pendingAction.data);
            }

            const result = await pendingAction.actionFn(pendingAction.data);
            if (result.success) {
                toast.success(pendingAction.successMsg);
            } else {
                toast.error("Error: " + result.error);
            }
        } catch (error) {
            console.error(`Failed to process action:`, error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSaving(false);
            setIsModalOpen(false);
            setPendingAction(null);
        }
    };


    const handleSavePersonalInfo = (data: any) => {
        handleAction(
            updatePersonalInformation,
            (d: any) => setPersonalData((prev: any) => ({ ...prev, ...d })),
            data,
            "Personal Information updated successfully!",
            "Personal Information"
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
            "Address updated successfully!",
            "Address Details"
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
            "Family background updated successfully!",
            "Family Background"
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
            "Educational background updated successfully!",
            "Educational Background"
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
            "Eligibility updated successfully!",
            "Eligibility Records"
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
            "Work Experience updated successfully!",
            "Work Experience"
        );
    };

    const handleSaveEmploymentDetails = (data: any) => {
        handleAction(
            (formData: any) => updateEmploymentDetails(formData.id, formData),
            (d: any) => setEmploymentData((prev: any) => ({ ...prev, ...d })),
            data,
            "Employment details updated successfully!",
            "Employment Details"
        );
    };

    const handleDeleteEmployeeClick = () => {
        setPendingAction({
            actionFn: () => deleteEmployee(employmentData.id_number),
            stateSetter: null,
            data: null,
            successMsg: "Employee profile deleted successfully!",
            actionName: "Delete Employee",
            isDelete: true
        });
        setIsModalOpen(true);
    };

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
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl transition-colors duration-300">
                        <h3 className="text-gray-900 dark:text-zinc-100 font-medium">Coming Soon</h3>
                        <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">The {activeTab} form is under construction.</p>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight transition-colors">
                        {role === null ? "My Profile" : "Employee Profile"}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors">
                        {role === null ? "Manage your personal data and employment records." : "View and manage employee records."}
                    </p>
                </div>
                {role === "moderator" && (
                    <button
                        onClick={handleDeleteEmployeeClick}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        Delete Employee
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-4 lg:col-span-3 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center transition-colors duration-300">
                        <ProfilePictureUpload
                            userId={userData.id}
                            initialImage={userData.profile_picture}
                            size="lg"
                        />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100 capitalize transition-colors">
                            {personalData.firstname} {personalData.surname}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1 transition-colors">
                            {employmentData.department || "No Department Set"}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden md:p-0 transition-colors duration-300">

                        <div className="md:hidden">
                            <select
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value)}
                                className="block w-full rounded-lg border-gray-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 py-3 pl-4 pr-10 text-sm font-medium text-gray-700 dark:text-zinc-300 focus:border-[#1a6b36] focus:outline-none focus:ring-1 focus:ring-[#1a6b36] transition-colors"
                            >
                                {menuItems.map((item) => (
                                    <option key={item} value={item} className="bg-white dark:bg-zinc-900">
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <nav className="hidden md:flex flex-col p-2 space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setActiveTab(item)}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${activeTab === item
                                        ? "bg-[#1a6b36] text-white shadow-sm"
                                        : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-100"
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden p-6 transition-colors duration-300">
                        {renderContent()}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => {
                    if (!isSaving) {
                        setIsModalOpen(false);
                        setPendingAction(null);
                    }
                }}
                onConfirm={confirmExecuteAction}
                isConfirming={isSaving}
                title={pendingAction?.isDelete ? "Delete Employee Profile" : "Confirm Changes"}
                subtitle={
                    pendingAction?.isDelete
                        ? "Warning: This action cannot be undone."
                        : `You are updating ${pendingAction?.actionName}`
                }
                message={
                    pendingAction?.isDelete ? (
                        <p>
                            Are you absolutely sure you want to permanently delete the profile for <strong>{personalData.firstname} {personalData.surname}</strong>? All their records will be erased.
                        </p>
                    ) : (
                        <p>
                            Are you sure you want to save these changes? This will update the <strong>{pendingAction?.actionName}</strong> records for <strong>{personalData.firstname} {personalData.surname}</strong>.
                        </p>
                    )
                }
                confirmText={pendingAction?.isDelete ? "Delete Profile" : "Save Changes"}
                confirmColorClass={pendingAction?.isDelete ? "bg-red-600 hover:bg-red-700" : "bg-[#1a6b36] hover:bg-[#134d26] dark:hover:bg-[#208242]"}
            />
        </div>
    );
}