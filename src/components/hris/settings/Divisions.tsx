// src/components/hris/settings/Divisions.tsx
"use client";

import { addDivision, deleteDivision, updateDivision } from "@/actions/admin/settings/divisions/action";
import { useState } from "react";
// Import your server actions (adjust the path if necessary)

// Define the shape of the data we expect to receive
type Division = {
    id: string;
    division: string;
    description: string | null;
};

interface DivisionsTemplateProps {
    data: Division[];
}

export default function Divisions({ data }: DivisionsTemplateProps) {
    const [editingId, setEditingId] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            {/* 1. ADD NEW DEPARTMENT FORM */}
            <form action={addDivision} className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input
                    type="text"
                    name="division"
                    placeholder="Division Name"
                    required
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm"
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description (Optional)"
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm"
                />
                <button type="submit" className="bg-[#1a6b36] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-800 transition">
                    Add Division
                </button>
            </form>

            {/* 2. DIVISIONS TABLE */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Description</th>
                            <th className="px-4 py-3 font-medium text-gray-700 w-32 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {data.map((div) => (
                            <tr key={div.id}>
                                {/* IF EDITING THIS ROW */}
                                {editingId === div.id ? (
                                    <td colSpan={3} className="px-4 py-3">
                                        <form
                                            action={(formData) => {
                                                updateDivision(div.id, formData);
                                                setEditingId(null);
                                            }}
                                            className="flex gap-2"
                                        >
                                            <input type="text" name="department" defaultValue={div.division} required className="flex-1 border rounded px-2 py-1 text-sm" />
                                            <input type="text" name="description" defaultValue={div.description || ""} className="flex-1 border rounded px-2 py-1 text-sm" />
                                            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium">Save</button>
                                            <button type="button" onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium">Cancel</button>
                                        </form>
                                    </td>
                                ) : (
                                    /* NORMAL ROW DISPLAY */
                                    <>
                                        <td className="px-4 py-3 font-medium text-gray-900">{div.division}</td>
                                        <td className="px-4 py-3 text-gray-500">{div.description || "—"}</td>
                                        <td className="px-4 py-3 text-right space-x-3">
                                            <button onClick={() => setEditingId(div.id)} className="text-blue-600 hover:underline text-xs font-medium">Edit</button>
                                            <button onClick={() => {
                                                if (confirm("Are you sure you want to delete this department?")) {
                                                    deleteDivision(div.id);
                                                }
                                            }} className="text-red-600 hover:underline text-xs font-medium">
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                                    No divisions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}