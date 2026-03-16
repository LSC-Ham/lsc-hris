'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';
import { deleteProfilePicture, uploadProfilePicture } from '@/actions/users/action';

interface ProfilePictureProps {
    userId: string;
    initialImage?: string | null;
    size?: 'sm' | 'lg';
    isEditable?: boolean; 
}

export default function ProfilePictureUpload({
    userId,
    initialImage,
    size = 'lg',
    isEditable = true 
}: ProfilePictureProps) {

    const [imagePreview, setImagePreview] = useState<string | null>(() => {
        if (!initialImage) return null;

        if (initialImage.startsWith('blob:') || initialImage.startsWith('http')) {
            return initialImage;
        }

        return `/api/profile_picture?fileName=${initialImage}`;
    });

    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showOptions, setShowOptions] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [rawImage, setRawImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const containerClasses = size === 'sm'
        ? 'w-10 h-10 border border-gray-200'
        : 'w-24 h-24 border-4 border-white mb-4';

    const iconClasses = size === 'sm' ? 'w-5 h-5' : 'w-8 h-8';
    const overlayTextClasses = size === 'sm' ? 'text-[8px]' : 'text-xs';

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setRawImage(previewUrl);
            e.target.value = ''; 
        }
    };

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropAndSave = async () => {
        try {
            if (!rawImage || !croppedAreaPixels) return;
            setIsUploading(true);

            const croppedImageUrl = await getCroppedImg(rawImage, croppedAreaPixels);

            if (croppedImageUrl) {
                const response = await fetch(croppedImageUrl);
                const blob = await response.blob();

                const formData = new FormData();
                formData.append('file', blob, 'profile.jpg');
                formData.append('userId', userId);

                const result = await uploadProfilePicture(formData);

                if (result.success) {
                    setImagePreview(croppedImageUrl);
                    setRawImage(null);
                } else {
                    console.error("Server upload failed");
                }
            }
        } catch (e) {
            console.error("Failed to crop and upload image", e);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeletePicture = async () => {
        const confirmDelete = window.confirm("Are you sure you want to remove your profile picture?");
        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            const result = await deleteProfilePicture(userId);
            if (result.success) {
                setImagePreview(null);
            } else {
                alert("Failed to remove picture.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while deleting.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDownload = async () => {
        if (!imagePreview) return;

        try {
            const response = await fetch(imagePreview);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `profile_picture_${userId}.jpg`;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);

            setShowOptions(false);
        } catch (error) {
            console.error("Failed to download image", error);
            alert("Could not download the image.");
        }
    };

    const AvatarImage = (
        <>
            {imagePreview ? (
                <Image src={imagePreview} alt="Profile" fill className="object-cover" unoptimized />
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`${iconClasses} opacity-70`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                </svg>
            )}
        </>
    );

    return (
        <div className="flex flex-col items-center">

            {isEditable ? (
                <button
                    onClick={() => setShowOptions(true)}
                    disabled={isUploading || isDeleting}
                    className={`relative rounded-full bg-green-50 shadow-sm flex items-center justify-center text-[#1a6b36] overflow-hidden group hover:bg-green-100 transition-colors disabled:opacity-50 ${containerClasses}`}
                >
                    {AvatarImage}
                    <div className={`absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white font-semibold ${overlayTextClasses}`}>
                        {isDeleting ? "Removing..." : "Edit"}
                    </div>
                </button>
            ) : (
                <div className={`relative rounded-full bg-green-50 shadow-sm flex items-center justify-center text-[#1a6b36] overflow-hidden ${containerClasses}`}>
                    {AvatarImage}
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
            />

            {showOptions && isEditable && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 transition-opacity"
                    onClick={() => setShowOptions(false)}
                >
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 bg-gray-50 flex flex-col items-center border-b border-gray-100">
                            <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-md bg-green-50 flex items-center justify-center text-[#1a6b36] overflow-hidden mb-4">
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Current Profile" fill className="object-cover" unoptimized />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 opacity-60">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Profile Photo</h3>
                        </div>

                        <button onClick={() => { setShowOptions(false); fileInputRef.current?.click(); }} className="p-4 text-center font-semibold text-[#1a6b36] hover:bg-gray-50 border-b border-gray-100 transition-colors">
                            Upload Photo
                        </button>

                        {imagePreview && (
                            <button onClick={handleDownload} className="p-4 text-center font-semibold text-blue-600 hover:bg-blue-50 border-b border-gray-100 transition-colors">
                                Download Photo
                            </button>
                        )}

                        {imagePreview && (
                            <button onClick={() => { setShowOptions(false); handleDeletePicture(); }} className="p-4 text-center font-semibold text-red-500 hover:bg-red-50 border-b border-gray-100 transition-colors">
                                Remove Current Photo
                            </button>
                        )}

                        <button onClick={() => setShowOptions(false)} className="p-4 text-center font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {rawImage && isEditable && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md flex flex-col items-center">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Adjust Profile Picture</h3>
                        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-6">
                            <Cropper image={rawImage} crop={crop} zoom={zoom} aspect={1} cropShape="round" onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                        </div>
                        <div className="w-full mb-6">
                            <label className="text-sm text-gray-600 mb-2 block">Zoom</label>
                            <input type="range" value={zoom} min={1} max={3} step={0.1} aria-labelledby="Zoom" onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-[#1a6b36]" />
                        </div>
                        <div className="flex gap-4 w-full justify-end">
                            <button onClick={() => setRawImage(null)} disabled={isUploading} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50">Cancel</button>
                            <button onClick={handleCropAndSave} disabled={isUploading} className="px-4 py-2 rounded-lg bg-[#1a6b36] text-white hover:bg-[#145229] transition-colors font-medium disabled:opacity-50">
                                {isUploading ? "Saving..." : "Save Picture"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}