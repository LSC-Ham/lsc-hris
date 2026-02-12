export function FamilyBackground() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Family Background</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">First Name</label>
                    <input type="text" defaultValue="Juan" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-green-500 outline-none transition-all" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Last Name</label>
                    <input type="text" defaultValue="Dela Cruz" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-green-500 outline-none transition-all" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Middle Name</label>
                    <input type="text" defaultValue="Santos" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-green-500 outline-none transition-all" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Date of Birth</label>
                    <input type="date" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-green-500 outline-none transition-all" />
                </div>
            </div>

            {/* Example: Footer just for this section */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button className="bg-[#1a6b36] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#155a2b]">
                    Save
                </button>
            </div>
        </div>
    );
}