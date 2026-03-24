// src\app\hris\(protected)\(human-resource)\departments\[department]\EmployeeDropdownCard.tsx
"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { ConfirmModal } from "@/components/ui/ConfirmModal"; // Adjust path if necessary
import { setDepartmentRole } from "@/actions/employees/employment_details/action";
import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";

interface Props {
    id_number: string;
    firstName: string;
    lastName: string;
    userId: string;
    profilePicture: string;
    joinedDate: string;
    departmentName: string;
    currentRole: string | null;
}

export default function EmployeeDropdownCard({ id_number, firstName, lastName, userId, profilePicture, joinedDate, departmentName, currentRole }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [isPending, startTransition] = useTransition();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleToSet, setRoleToSet] = useState<string | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOpenModal = (role: string) => {
        setRoleToSet(role);
        setIsOpen(false);
        setIsModalOpen(true);
    };

    const handleConfirmRoleChange = () => {
        if (!roleToSet) return;

        startTransition(async () => {
            await setDepartmentRole(id_number, roleToSet, departmentName);
            setIsModalOpen(false);
            setRoleToSet(null);
        });
    };

    return (
        <>
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isPending}
                    className={`cursor-pointer w-full flex items-center text-left gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border transition-all group shadow-sm
                        ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:border-[#1a6b36]/40 dark:hover:border-[#28a152]/40 border-gray-200 dark:border-zinc-800'}
                        ${currentRole === 'Head' ? 'ring-2 ring-[#1a6b36]/20 border-[#1a6b36]/40' : ''}`}
                >
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-zinc-700 group-hover:bg-[#1a6b36]/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 font-bold border border-gray-200 dark:border-zinc-700 overflow-hidden shadow-sm">
                            <ProfilePictureUpload userId={userId} initialImage={profilePicture} size="sm" isEditable={false} />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 capitalize truncate group-hover:text-[#1a6b36] transition-colors">
                                {firstName} {lastName}
                            </p>
                            {currentRole && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1a6b36]/10 text-[#1a6b36] dark:bg-[#28a152]/20 dark:text-[#28a152] uppercase tracking-wider">
                                    {currentRole}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate mt-0.5">
                            Joined {joinedDate}
                        </p>
                    </div>

                    <svg className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-lg z-50 py-2 overflow-hidden">
                        <Link
                            href={`/hris/employees/${id_number}`}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            View Profile
                        </Link>

                        <div className="h-px bg-gray-100 dark:bg-zinc-800 my-1"></div>

                        <button
                            onClick={() => handleOpenModal('Head')}
                            className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-[#1a6b36] dark:text-[#28a152] hover:bg-green-50 dark:hover:bg-[#1a6b36]/10 transition-colors font-medium"
                        >
                            Set as Head
                        </button>

                        <button
                            onClick={() => handleOpenModal('Assistant Head')}
                            className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-[#1a6b36] dark:text-[#28a152] hover:bg-green-50 dark:hover:bg-[#1a6b36]/10 transition-colors font-medium"
                        >
                            Set as Assistant Head
                        </button>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmRoleChange}
                title="Change Department Role"
                subtitle={`Department: ${departmentName}`}
                isConfirming={isPending}
                confirmText={`Set as ${roleToSet}`}
                message={
                    <span>
                        Are you sure you want to assign <strong>{firstName} {lastName}</strong> as the new <strong>{roleToSet}</strong>?
                        <br /><br />
                        This will automatically remove the {roleToSet} designation from whoever currently holds the position in this department.
                    </span>
                }
            />
        </>
    );
}