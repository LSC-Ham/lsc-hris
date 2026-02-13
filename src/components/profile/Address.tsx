"use client";

import { useState, useEffect, ChangeEvent } from "react";

// 1. MAIN COMPONENT (The Container)
export function Address() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* SECTION 1: Residential Address */}
            <AddressSection
                title="Residential Address"
                initialData={{
                    region: "",
                    province: "",
                    city: "",
                    barangay: "",
                    house_no: "",
                    street: "",
                    subdivision: "",
                    zip_code: "",
                }}
            />

            {/* SECTION 2: Permanent Address */}
            <AddressSection
                title="Permanent Address"
                initialData={{
                    region: "",
                    province: "",
                    city: "",
                    barangay: "",
                    house_no: "",
                    street: "",
                    subdivision: "",
                    zip_code: "",
                }}
            />
        </div>
    );
}

// ----------------------------------------------------------------------
// 2. SMART SECTION COMPONENT (API LOGIC)
// ----------------------------------------------------------------------

interface AddressData {
    region: string;
    province: string;
    city: string;
    barangay: string;
    house_no: string;
    street: string;
    subdivision: string;
    zip_code: string;
}

interface GeoEntity {
    code: string;
    name: string;
}

function AddressSection({ title, initialData }: { title: string, initialData: AddressData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(initialData);

    // --- PSGC Data State ---
    const [regions, setRegions] = useState<GeoEntity[]>([]);
    const [provinces, setProvinces] = useState<GeoEntity[]>([]);
    const [cities, setCities] = useState<GeoEntity[]>([]);
    const [barangays, setBarangays] = useState<GeoEntity[]>([]);

    // --- Loading States ---
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingBarangays, setLoadingBarangays] = useState(false);

    // 1. Fetch Regions on Mount (or when editing starts)
    useEffect(() => {
        if (isEditing && regions.length === 0) {
            setLoadingRegions(true);
            fetch("https://psgc.gitlab.io/api/regions/")
                .then(res => res.json())
                .then(data => setRegions(data.sort((a: GeoEntity, b: GeoEntity) => a.name.localeCompare(b.name))))
                .catch(err => console.error(err))
                .finally(() => setLoadingRegions(false));
        }
    }, [isEditing]);

    // 2. Handle Region Change -> Fetch Provinces (or Cities if NCR)
    const handleRegionChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        const selectedRegion = regions.find(r => r.name === selectedName);

        setFormData(prev => ({ ...prev, region: selectedName, province: "", city: "", barangay: "" }));
        setProvinces([]);
        setCities([]);
        setBarangays([]);

        if (selectedRegion) {
            setLoadingProvinces(true);
            try {
                // Try fetching provinces first
                const provRes = await fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion.code}/provinces/`);
                const provData = await provRes.json();

                if (provData.length > 0) {
                    // Normal Region
                    setProvinces(provData.sort((a: GeoEntity, b: GeoEntity) => a.name.localeCompare(b.name)));
                } else {
                    // Metro Manila (NCR) has no provinces, fetch cities directly
                    setLoadingCities(true);
                    const cityRes = await fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion.code}/cities-municipalities/`);
                    const cityData = await cityRes.json();
                    setCities(cityData.sort((a: GeoEntity, b: GeoEntity) => a.name.localeCompare(b.name)));
                    setLoadingCities(false);
                }
            } catch (error) {
                console.error("Error fetching sub-regions:", error);
            }
            setLoadingProvinces(false);
        }
    };

    // 3. Handle Province Change -> Fetch Cities
    const handleProvinceChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        const selectedProv = provinces.find(p => p.name === selectedName);

        setFormData(prev => ({ ...prev, province: selectedName, city: "", barangay: "" }));
        setCities([]);
        setBarangays([]);

        if (selectedProv) {
            setLoadingCities(true);
            fetch(`https://psgc.gitlab.io/api/provinces/${selectedProv.code}/cities-municipalities/`)
                .then(res => res.json())
                .then(data => setCities(data.sort((a: GeoEntity, b: GeoEntity) => a.name.localeCompare(b.name))))
                .catch(console.error)
                .finally(() => setLoadingCities(false));
        }
    };

    // 4. Handle City Change -> Fetch Barangays
    const handleCityChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        const selectedCity = cities.find(c => c.name === selectedName);

        setFormData(prev => ({ ...prev, city: selectedName, barangay: "" }));
        setBarangays([]);

        if (selectedCity) {
            setLoadingBarangays(true);
            fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCity.code}/barangays/`)
                .then(res => res.json())
                .then(data => setBarangays(data.sort((a: GeoEntity, b: GeoEntity) => a.name.localeCompare(b.name))))
                .catch(console.error)
                .finally(() => setLoadingBarangays(false));
        }
    };

    // 5. Standard Input Change
    const handleChange = (field: keyof AddressData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // 6. UI Actions
    const handleCancel = () => {
        setIsEditing(false);
        setFormData(initialData);
        // Optional: clear fetched data or keep it cached
    };

    const handleSave = () => {
        // Here you would typically send the data to your backend API
        console.log(`Saving ${title}:`, formData);
        alert(`Saved changes for ${title}!`);
        setIsEditing(false);
    };

    return (
        <div>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h2>
                <button
                    type="button"
                    onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                    className="text-[#1a6b36] text-sm font-medium hover:text-[#155a2b] transition-colors"
                >
                    {isEditing ? "Cancel" : "Edit"}
                </button>
            </div>

            {/* FORM GRID */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* --- CASCADING DROPDOWNS --- */}

                    {/* Region */}
                    <AddressSelect
                        label="Region"
                        value={formData.region}
                        options={regions}
                        isEditing={isEditing}
                        isLoading={loadingRegions}
                        onChange={handleRegionChange}
                        required
                    />

                    {/* Province (Hidden/Disabled if list is empty, e.g. NCR) */}
                    <AddressSelect
                        label="Province"
                        value={formData.province}
                        options={provinces}
                        isEditing={isEditing}
                        isLoading={loadingProvinces}
                        onChange={handleProvinceChange}
                        disabled={provinces.length === 0}
                        placeholder={provinces.length === 0 && formData.region ? "N/A (Metro Manila)" : "Select Province"}
                        required
                    />

                    {/* City */}
                    <AddressSelect
                        label="City / Municipality"
                        value={formData.city}
                        options={cities}
                        isEditing={isEditing}
                        isLoading={loadingCities}
                        onChange={handleCityChange}
                        disabled={cities.length === 0}
                        required
                    />

                    {/* Barangay */}
                    <AddressSelect
                        label="Barangay"
                        value={formData.barangay}
                        options={barangays}
                        isEditing={isEditing}
                        isLoading={loadingBarangays}
                        onChange={(e) => handleChange("barangay", e.target.value)}
                        disabled={barangays.length === 0}
                        required
                    />

                    {/* --- STANDARD TEXT FIELDS --- */}

                    <AddressField
                        label="House/Block/Lot No."
                        value={formData.house_no}
                        isEditing={isEditing}
                        onChange={(e) => handleChange("house_no", e.target.value)}
                    />
                    <AddressField
                        label="Street Address"
                        value={formData.street}
                        isEditing={isEditing}
                        onChange={(e) => handleChange("street", e.target.value)}
                    />
                    <AddressField
                        label="Subdivision/Village"
                        value={formData.subdivision}
                        isEditing={isEditing}
                        onChange={(e) => handleChange("subdivision", e.target.value)}
                    />
                    <AddressField
                        label="Zip Code"
                        value={formData.zip_code}
                        isEditing={isEditing}
                        onChange={(e) => handleChange("zip_code", e.target.value)}
                        required
                    />
                </div>

                {/* SAVE BUTTON */}
                {isEditing && (
                    <div className="flex justify-end pt-6 border-t border-gray-100 mt-6 animate-in fade-in">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-[#1a6b36] text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#155a2b] transition-all active:scale-95"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}


// ----------------------------------------------------------------------
// 3. HELPER COMPONENTS
// ----------------------------------------------------------------------

// Standard Text Input
interface AddressFieldProps {
    label: string;
    value: string;
    isEditing: boolean;
    type?: string;
    required?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function AddressField({ label, value, isEditing, type = "text", required, onChange }: AddressFieldProps) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {isEditing ? (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`w-full p-2.5 border rounded-lg text-sm transition-all shadow-sm outline-none bg-white 
                    ${required && !value
                            ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                            : "border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        }`}
                />
            ) : (
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}

// Dropdown Select Input (New!)
interface AddressSelectProps {
    label: string;
    value: string;
    options: GeoEntity[];
    isEditing: boolean;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    isLoading?: boolean;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
}

function AddressSelect({ label, value, options, isEditing, onChange, isLoading, disabled, required, placeholder }: AddressSelectProps) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {isEditing ? (
                <div className="relative">
                    <select
                        value={value}
                        onChange={onChange}
                        disabled={disabled || isLoading}
                        required={required}
                        className={`w-full p-2.5 border rounded-lg text-sm transition-all shadow-sm appearance-none outline-none
                        ${disabled
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 border-gray-200"
                            }
                        ${required && !value && !disabled ? "border-red-300" : ""}
                        `}
                    >
                        <option value="" disabled>{isLoading ? "Loading..." : (placeholder || `Select ${label}`)}</option>
                        {options.map((opt) => (
                            <option key={opt.code} value={opt.name}>
                                {opt.name}
                            </option>
                        ))}
                    </select>
                    {/* Custom Arrow Icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        {isLoading ? (
                            <div className="h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-full p-2.5 border border-transparent bg-gray-50 rounded-lg text-sm text-gray-800 min-h-[42px] flex items-center">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}