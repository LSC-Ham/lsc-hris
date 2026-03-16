"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const name = searchParams.get("name");
    const username = searchParams.get("username");
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    return (
        <div className="">
            <div className="flex justify-between items-center mb-8 print:hidden bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <button 
                    onClick={() => router.push("/employees")}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Employee List
                </button>
                <button 
                    onClick={() => window.print()}
                    className="bg-[#1a6b36] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-green-800 transition shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Credentials Slip
                </button>
            </div>

            {/* PRINTABLE SLIP */}
            <div className="bg-white border-2 border-gray-300 rounded-xl p-8 shadow-sm relative overflow-hidden">
                {/* Visual accent line */}
                <div className="absolute top-0 left-0 w-2 h-full bg-[#1a6b36] print:bg-[#1a6b36]" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} />

                <div className="text-center border-b border-gray-200 pb-6 mb-8">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Employee Account Credentials</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Confidential Information • Do Not Share</p>
                </div>

                <div className="space-y-8 px-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Employee Name</label>
                        <p className="text-2xl font-bold text-gray-900 uppercase">{name || "N/A"}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Login Username (ID)</label>
                            <p className="text-3xl font-mono font-black text-[#1a6b36] tracking-tight">{username || "---"}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Temporary Password</label>
                            <p className="text-3xl font-mono font-black text-[#1a6b36] tracking-tight">{password || "---"}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Registered Email</label>
                        <p className="text-lg font-medium text-gray-800">{email || "No email provided"}</p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl mt-8" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                        <h4 className="text-sm font-bold text-amber-900 uppercase mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Mandatory Next Steps
                        </h4>
                        <ol className="text-sm text-amber-900 space-y-2 ml-7 list-decimal font-medium">
                            <li>Log in to the HRIS portal using the credentials provided above.</li>
                            <li>You will be prompted to change your temporary password immediately.</li>
                            <li>Ensure your new password is secure and memorable.</li>
                        </ol>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-end text-xs text-gray-400 font-medium">
                    <div>
                        Date Generated: {new Date().toLocaleDateString()}
                    </div>
                    <div className="text-right">
                        System Generated Document
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body { 
                        background: white !important; 
                        padding: 0 !important; 
                    }
                    .print\:hidden { 
                        display: none !important; 
                    }
                    /* Hide Next.js layout elements (adjust selectors if your layout uses different tags) */
                    nav, header, footer, aside, .sidebar { 
                        display: none !important; 
                    }
                    main { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        width: 100% !important;
                    }
                    /* Ensure backgrounds print correctly */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>
        </div>
    );
}