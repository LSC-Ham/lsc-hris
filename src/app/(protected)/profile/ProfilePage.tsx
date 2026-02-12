"use client";

import { useState } from "react";

// Import your new components here
import { PersonalInformation } from "@/components/profile/ProfileInformation";
import { Address } from "@/components/profile/Address";
import { FamilyBackground } from "@/components/profile/FamilyBackground";
import { EmploymentDetails } from "@/components/profile/EmploymentDetails";

interface ProfilePageProps {
    initialData: any; // You can be more specific with the type if you want
}

export default function ProfilePage({ initialData }: ProfilePageProps) {
    const [activeTab, setActiveTab] = useState("Employment Details");

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

    const [formData, setFormData] = useState({
        // --- Personal Information Fields ---
        // We use the server data if it exists, otherwise default to empty
        surname: initialData?.surname || "",
        firstname: initialData?.firstname || "",
        middlename: initialData?.middlename || "",
        extension: initialData?.extension || "",
        birthdate: initialData?.birthdate || "",
        birthplace: initialData?.birthplace || "",
        sex: initialData?.sex || "",
        civil_status: initialData?.civil_status || "",
        telephone_no: initialData?.telephone_no || "",
        mobile_no: initialData?.mobile_no || "",
        email: initialData?.email || "",
        nationality: initialData?.nationality || "",
        height: initialData?.height || "",
        weight: initialData?.weight || "",
        blood_type: initialData?.blood_type || "",

        // --- Employment Details Fields (Existing) ---
        position: initialData?.position || "HR Admin",
        department: initialData?.department || "Human Resources",
        employeeId: initialData?.id || "", // mapped from employee.id

        // --- Address Fields (For later) ---
        street: "",
        city: "",
        province: "",
    });

    const handleInputChange = (fieldOrEvent: any, value?: any) => {
        // CHECK: Is this a direct (key, value) update from our Smart Components?
        if (typeof fieldOrEvent === 'string') {
            setFormData((prev: any) => ({
                ...prev,
                [fieldOrEvent]: value
            }));
        }
        // OTHERWISE: It's a standard HTML event (from simple inputs)
        else {
            const { name, value } = fieldOrEvent.target;
            setFormData((prev: any) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // This helper function decides what to render
    const renderContent = () => {
        switch (activeTab) {
            case "Employment Details":
                return <EmploymentDetails formData={formData} onChange={handleInputChange} />;
            case "Personal Information":
                return <PersonalInformation formData={formData} onChange={handleInputChange} />;
            case "Employee Address":
                return <Address />;
            case "Family Background":
                return <FamilyBackground />;
            // Add more cases here as you create files:
            // case "Family Background":
            //   return <FamilyBackgroundForm />;
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
                            JD
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Juan Dela Cruz</h2>
                        <p className="text-xs text-gray-500 mb-1">HR Admin</p>
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