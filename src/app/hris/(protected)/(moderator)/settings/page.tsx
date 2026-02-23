export default async function Page() {

    return (
        <div className="space-y-6">
            {/* 1. PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        HRIS Settings
                    </h1>
                    <p className="text-sm text-gray-500">
                        Modify your System Settings
                    </p>
                </div>
            </div>
        </div>
    );
}