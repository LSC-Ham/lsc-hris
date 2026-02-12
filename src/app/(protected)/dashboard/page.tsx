export default function Home() {
    return (
        <div className="space-y-6">
            {/* 1. PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        LSC - HRIS
                    </h1>
                    <p className="text-sm text-gray-500">
                        A short description of what this page is for.
                    </p>
                </div>

                {/* Optional: Action Button (Top Right) */}
                <button className="bg-[#1a6b36] hover:bg-[#155a2b] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                    <span>+ Create New</span>
                </button>
            </div>

            {/* 2. PAGE CONTENT */}
            {/* This is the white card where your forms/tables live */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

                {/* Your content goes here */}
                <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                    Content Placeholder
                </div>

            </div>
        </div>
    );
}