"use client";

interface PrintableSlipProps {
    name: string;
    username: string;
    email: string;
    password?: string;
    onClose: () => void;
}

export function PrintableSlip({ name, username, email, password, onClose }: PrintableSlipProps) {
    const firstName = name?.split(' ')[0] || "Employee";

    return (
        <div className="flex flex-col items-center font-sans">
            <div className="w-full max-w-[210mm] flex justify-between items-center mb-6 print:hidden">
                <button
                    onClick={onClose}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to HRIS
                </button>
                <button
                    onClick={() => window.print()}
                    className="bg-[#1a6b36] hover:bg-[#155a2b] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Credentials
                </button>
            </div>

            <div className="a4-document bg-white border border-[#dadce0] sm:rounded-2xl relative overflow-hidden">
                <div className="w-full h-2 bg-[#1a6b36] absolute top-0 left-0" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} />

                <div className="px-10 pt-14 pb-12">
                    <div className="flex items-center gap-5 mb-10 border-b border-[#dadce0] pb-8">
                        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-[#1a6b36] shrink-0 border border-green-100" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-[26px] leading-tight font-normal text-gray-900 tracking-tight">Account Credentials</h1>
                            <p className="text-sm text-gray-500 mt-1">Confidential • Issued to {name}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-medium text-gray-900 mb-1">Welcome to the team, {firstName}!</h2>
                            <p className="text-[15px] text-gray-600 leading-relaxed">
                                Your enterprise system access has been successfully provisioned. Please use the secure credentials below to access your employee portal for the first time.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-5" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                                <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Username / Employee ID</p>
                                <p className="text-2xl font-mono text-gray-900">{username || "---"}</p>
                            </div>
                            <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-5" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                                <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Temporary Password</p>
                                <p className="text-2xl font-mono text-gray-900">{password || "---"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-[15px] text-gray-700 bg-white border border-[#dadce0] rounded-lg p-4">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Registered Email: <strong className="font-medium text-gray-900">{email || "No email provided"}</strong></span>
                        </div>

                        <div className="bg-[#fef7e0] rounded-xl p-6 mt-8 border border-[#fbd28c]" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                            <h3 className="text-[15px] font-bold text-[#b06000] flex items-center gap-2 mb-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Security Requirements
                            </h3>
                            <ul className="text-[14px] text-[#724300] space-y-2 ml-2 list-disc list-inside leading-relaxed">
                                <li>Log in immediately using the temporary password provided above.</li>
                                <li>You will be required to create a new, strong password upon first login.</li>
                                <li>Do not share these credentials with anyone.</li>
                                <li>Shred or securely store this physical document after your initial login.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full px-10 py-5 bg-[#f8f9fa] border-t border-[#dadce0] flex justify-between items-center text-[13px] text-gray-500" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                    <span>Generated on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>System Generated Document</span>
                </div>
            </div>

            <style jsx global>{`
                .a4-document {
                    width: 210mm;
                    min-height: 297mm;
                    margin: 0 auto;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                }
                
                @media print {
                    @page { size: A4; margin: 0; }
                    body { background: white !important; margin: 0 !important; padding: 0 !important; }
                    .print\:hidden, nav, header, footer, aside, .sidebar { display: none !important; }
                    main { margin: 0 !important; padding: 0 !important; width: 100% !important; }
                    
                    .a4-document { 
                        width: 100% !important; 
                        min-height: 100vh !important; 
                        box-shadow: none !important; 
                        border: none !important; 
                        margin: 0 !important; 
                        padding: 20mm !important; 
                    }
                    
                    /* Ensures the Google footer stays at the bottom of the printed page */
                    .a4-document > div:last-child {
                        position: fixed !important;
                        bottom: 0 !important;
                    }

                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}</style>
        </div>
    );
}