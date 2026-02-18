"use client";

import { useState } from "react";

// Import your new components here
import { EmploymentDetails } from "@/components/profile/EmploymentDetails";
import { PersonalInformation } from "@/components/profile/ProfileInformation";
import { Address } from "@/components/profile/Address";
import { FamilyBackground } from "@/components/profile/FamilyBackground";

interface ProfilePageProps {
    personal_information: any;
    employment_details: any;
    address: any; // Ideally, this comes in from the server as an array of address objects
}

export default function ProfilePage({ personal_information, employment_details, address }: ProfilePageProps) {
    const [activeTab, setActiveTab] = useState("Employment Details");

    const findGovId = (label: string) => {
        if (!employment_details?.govt_ids) return "";
        const found = employment_details.govt_ids.find((id: any) => id.id_label === label);
        return found ? found.id_number : "";
    };

    // Helper to find specific address type if the server passes an array of addresses
    const getAddressByType = (type: string) => {
        // Look at the nested .address array from your server action's return object
        const addressArray = address?.address || [];
        return addressArray.find((a: any) => a.address_type === type) || {};
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
        "References",
    ];

    // --- 1. Main Flat Form Data (Personal & Employment) ---
    const [formData, setFormData] = useState({
        // Personal Information Fields
        surname: personal_information?.surname || "",
        firstname: personal_information?.firstname || "",
        middlename: personal_information?.middlename || "",
        extension: personal_information?.extension || "",
        birthdate: personal_information?.birthdate || "",
        birthplace: personal_information?.birthplace || "",
        sex: personal_information?.sex || "",
        civil_status: personal_information?.civil_status || "",
        telephone_no: personal_information?.telephone_no || "",
        mobile_no: personal_information?.mobile_no || "",
        email: personal_information?.email || "",
        nationality: personal_information?.nationality || "",
        height: personal_information?.height || "",
        weight: personal_information?.weight || "",
        blood_type: personal_information?.blood_type || "",

        // Employment Details Fields 
        id_number: employment_details?.id_number || "",
        division: employment_details?.division || "",
        department: employment_details?.department || "",
        positions: employment_details?.positions || [],
        gsis_no: findGovId("GSIS No."),
        pagibig_no: findGovId("Pag-IBIG No."),
        philhealth_no: findGovId("PhilHealth No."),
        sss_no: findGovId("SSS No."),
        tin_no: findGovId("TIN No."),
        agency_no: findGovId("Agency No."),
        govt_ids: employment_details?.govt_ids || [],
    });

    // --- 2. Separate Nested State for Addresses ---
    const [addressData, setAddressData] = useState({
        residential: {
            house_no: getAddressByType("Residential Address").house_no || "",
            street: getAddressByType("Residential Address").street || "",
            subdivision: getAddressByType("Residential Address").subdivision || "",
            region: getAddressByType("Residential Address").region || "",
            province: getAddressByType("Residential Address").province || "",
            city: getAddressByType("Residential Address").city || "",
            barangay: getAddressByType("Residential Address").barangay || "",
            zip_code: getAddressByType("Residential Address").zip_code || "",
        },
        permanent: {
            house_no: getAddressByType("Permanent Address").house_no || "",
            street: getAddressByType("Permanent Address").street || "",
            subdivision: getAddressByType("Permanent Address").subdivision || "",
            region: getAddressByType("Permanent Address").region || "",
            province: getAddressByType("Permanent Address").province || "",
            city: getAddressByType("Permanent Address").city || "",
            barangay: getAddressByType("Permanent Address").barangay || "",
            zip_code: getAddressByType("Permanent Address").zip_code || "",
        }
    });

    // Handler for flat data (Personal/Employment)
    const handleInputChange = (fieldOrEvent: any, value?: any) => {
        if (typeof fieldOrEvent === 'string') {
            setFormData((prev: any) => ({
                ...prev,
                [fieldOrEvent]: value
            }));
        } else {
            const { name, value } = fieldOrEvent.target;
            setFormData((prev: any) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // --- 3. Dedicated Handler for Nested Address Data ---
    // This now receives the fully finalized draft data at once
    const handleAddressChange = (updatedAddressData: any) => {
        setAddressData(updatedAddressData);
    };

    const handleSaveChanges = async () => {
        try {
            // When submitting, you now have access to both main data and address data
            const payload = {
                ...formData,
                addresses: [
                    { address_type: "Residential Address", ...addressData.residential },
                    { address_type: "Permanent Address", ...addressData.permanent }
                ]
            };

            console.log("Submitting this to database:", payload);
            alert("Changes saved successfully!");

        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save changes.");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Employment Details":
                return <EmploymentDetails formData={formData} onChange={handleInputChange} />;
            case "Personal Information":
                return <PersonalInformation formData={formData} onChange={handleInputChange} onSave={handleSaveChanges} />;
            case "Employee Address":
                return <Address formData={addressData} onChange={handleAddressChange} onSave={handleSaveChanges} />;
            case "Family Background":
                return <FamilyBackground />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-gray-900 font-medium">Coming Soon</h3>
                        <p className="text-gray-500 text-sm mt-1">The {activeTab} form is under construction.</p>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">My Profile</h1>
                <p className="text-sm text-gray-500">Manage your personal data and employment records.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* === LEFT COLUMN (Sticky Navigation) === */}
                <div className="md:col-span-4 lg:col-span-3 space-y-6 sticky top-6">
                    {/* User Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-green-50 border-4 border-white shadow-sm flex items-center justify-center mb-4 text-2xl font-bold text-[#1a6b36]">
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 capitalize">{formData.firstname} {formData.surname}</h2>
                        <p className="text-xs text-gray-500 mb-1">{formData.department}</p>
                    </div>

                    {/* Navigation Menu */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <nav className="flex flex-col p-2 space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setActiveTab(item)}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 flex justify-between items-center ${activeTab === item
                                        ? "bg-[#1a6b36] text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    {item}
                                    {activeTab === item && (
                                        <svg className="w-4 h-4 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* === RIGHT COLUMN (Dynamic Content) === */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    {/* Notice Area */}
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-4 shadow-sm">
                        <div className="p-2 bg-amber-100 rounded-full text-amber-600 shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-amber-900 text-sm">Editing: {activeTab}</h4>
                            <p className="text-xs text-amber-800 mt-1">
                                Please ensure all information provided is accurate and up to date.
                            </p>
                        </div>
                    </div>

                    {/* The Dynamic Form Container */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}