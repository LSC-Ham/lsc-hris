"use client";

import { useRouter } from "next/navigation";

interface LeaveRequest {
    id: string;
    leave_type: string;
    date: string;
    time_from: string;
    time_to: string;
    status: number;
    created_at: string;
    employees: {
        biography: {
            personal_information: {
                firstname: string;
                surname: string;
            }
        }
    };
}

interface Props {
    requests: LeaveRequest[];
}

export default function LeaveRequestsTable({ requests }: Props) {
    const router = useRouter();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const formatTime = (time: Date | string | null) => {
        if (!time) return "—";
        return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(time));
    };

    const getStatusBadge = (status: number) => {
        switch (status) {
            case 1:
                return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">Approved</span>;
            case 2:
                return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">Rejected</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">Pending</span>;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800 transition-colors duration-300">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Employee</th>
                        <th scope="col" className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Leave Type</th>
                        <th scope="col" className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Date & Time</th>
                        <th scope="col" className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900 transition-colors duration-300">
                    {requests.length > 0 ? (
                        requests.map((leave) => (
                            <tr
                                key={leave.id}
                                onClick={() => router.push(`/hris/leave/request/${leave.id}`)}
                                className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-gray-900 dark:text-zinc-100 capitalize">
                                        {leave.employees.biography.personal_information.firstname} {leave.employees.biography.personal_information.surname}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                                        Filed: {formatDate(leave.created_at)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-zinc-100 capitalize">
                                        {leave.leave_type}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-700 dark:text-zinc-300 font-medium">
                                        <span className="font-bold text-gray-900 dark:text-zinc-100">{formatDate(leave.date)}</span>
                                        <span className="block text-xs text-gray-500 dark:text-zinc-400">{formatTime(leave.time_from)} - {formatTime(leave.time_to)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(leave.status)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-zinc-400 text-sm">
                                No leave requests found in your department.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}