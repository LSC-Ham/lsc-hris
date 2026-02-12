import { EmploymentDetails } from "@/components/profile/EmploymentDetails";
import { PersonalInformation } from "@/components/profile/ProfileInformation";

export default function CreateUserPage() {
    return (
        <div className="space-y-6">
            {/* 1. PAGE HEADER */}
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

            {/* 2. PAGE CONTENT */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <EmploymentDetails mode="create" />
                <PersonalInformation mode="create" />
            </div>
        </div>
    );
}