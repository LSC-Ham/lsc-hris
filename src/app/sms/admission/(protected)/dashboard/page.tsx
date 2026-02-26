'use client';

export default function Page() {
    // Replace these with your actual state or data fetching logic
    const stats = {
        totalRows: 1250,
        totalEnrolled: 842,
        totalPending: 408
    };

    return (
        <div className="p-4 md:p-8">
            {/* Dashboard Container */}
            <div className="mx-auto mt-5 max-w-7xl rounded-[15px] border border-[#e9ecef] bg-white p-[30px] shadow-[0_5px_20px_rgba(26,127,92,0.05)]">
                
                {/* Header with animated underline effect */}
                <h1 className="relative mb-[30px] border-b-[3px] border-[#e8f5e9] pb-[15px] text-[2rem] font-semibold text-[#1a7f5c] after:absolute after:-bottom-[3px] after:left-0 after:h-[3px] after:w-[100px] after:rounded-sm after:bg-[#2ecc71]">
                    Admissions Dashboard
                </h1>

                {/* Grid Layout (Replaces Bootstrap .row and .col-md-4) */}
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                    
                    {/* Total Students Card */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a7f5c] to-[#0d5038] text-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(26,127,92,0.15)]">
                        <div className="flex items-center border-b border-white/10 bg-white/15 px-5 py-[15px] text-[1.1rem] font-semibold backdrop-blur-md">
                            <i className="fas fa-user-graduate mr-2.5 text-[1.2rem] opacity-90"></i> Total Students
                        </div>
                        <div className="flex h-[120px] items-center justify-center p-5">
                            <h5 className="text-[2.5rem] font-bold -tracking-[0.5px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                                {stats.totalRows}
                            </h5>
                        </div>
                    </div>

                    {/* Enrolled Students Card */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#27ae60] to-[#1a7f5c] text-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(26,127,92,0.15)]">
                        <div className="flex items-center border-b border-white/10 bg-white/15 px-5 py-[15px] text-[1.1rem] font-semibold backdrop-blur-md">
                            <i className="fas fa-check-circle mr-2.5 text-[1.2rem] opacity-90"></i> Enrolled Students
                        </div>
                        <div className="flex h-[120px] items-center justify-center p-5">
                            <h5 className="text-[2.5rem] font-bold -tracking-[0.5px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                                {stats.totalEnrolled}
                            </h5>
                        </div>
                    </div>

                    {/* Pending Students Card */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#f39c12] to-[#e67e22] text-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(26,127,92,0.15)]">
                        <div className="flex items-center border-b border-white/10 bg-white/15 px-5 py-[15px] text-[1.1rem] font-semibold backdrop-blur-md">
                            <i className="fas fa-clock mr-2.5 text-[1.2rem] opacity-90"></i> Pending Students
                        </div>
                        <div className="flex h-[120px] items-center justify-center p-5">
                            <h5 className="text-[2.5rem] font-bold -tracking-[0.5px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                                {stats.totalPending}
                            </h5>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}