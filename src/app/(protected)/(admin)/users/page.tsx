export default function EmployeesLists() {
    return (
        <div className="space-y-6">
            {/* 1. PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        Employees
                    </h1>
                    <p className="text-sm text-gray-500">
                        A short description of what this page is for.
                    </p>
                </div>
            </div>

            {/* 2. PAGE CONTENT */}
            {/* This is the white card where your forms/tables live */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

                <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                    Content Placeholder
                </div>

            </div>
        </div>
    );
}