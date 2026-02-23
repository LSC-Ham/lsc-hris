// src/components/hris/settings/Positions.tsx
"use client";

import { addPosition, deletePosition, updatePosition } from "@/actions/admin/settings/positions/action";
import { useState } from "react";
// Import your server actions (adjust the path if necessary)

// Define the shape of the data we expect to receive
type Position = {
    id: string;
    position: string;
    description: string | null;
};

interface PositionsTemplateProps {
    data: Position[];
}

export default function Positions({ data }: PositionsTemplateProps) {
    const [editingId, setEditingId] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            {/* 1. ADD NEW POSITION FORM */}
            <form action={addPosition} className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input
                    type="text"
                    name="position"
                    placeholder="Position Name"
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
                    Add Position
                </button>
            </form>

            {/* 2. POSITIONS TABLE */}
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
                        {data.map((pos) => (
                            <tr key={pos.id}>
                                {/* IF EDITING THIS ROW */}
                                {editingId === pos.id ? (
                                    <td colSpan={3} className="px-4 py-3">
                                        <form
                                            action={(formData) => {
                                                updatePosition(pos.id, formData);
                                                setEditingId(null);
                                            }}
                                            className="flex gap-2"
                                        >
                                            <input type="text" name="position" defaultValue={pos.position} required className="flex-1 border rounded px-2 py-1 text-sm" />
                                            <input type="text" name="description" defaultValue={pos.description || ""} className="flex-1 border rounded px-2 py-1 text-sm" />
                                            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium">Save</button>
                                            <button type="button" onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium">Cancel</button>
                                        </form>
                                    </td>
                                ) : (
                                    /* NORMAL ROW DISPLAY */
                                    <>
                                        <td className="px-4 py-3 font-medium text-gray-900">{pos.position}</td>
                                        <td className="px-4 py-3 text-gray-500">{pos.description || "—"}</td>
                                        <td className="px-4 py-3 text-right space-x-3">
                                            <button onClick={() => setEditingId(pos.id)} className="text-blue-600 hover:underline text-xs font-medium">Edit</button>
                                            <button onClick={() => {
                                                if (confirm("Are you sure you want to delete this position?")) {
                                                    deletePosition(pos.id);
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
                                    No positions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}