/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState, ChangeEvent, FormEvent } from "react";
import { Camera, Image as ImageIcon } from "lucide-react"; // Import icons from lucide
import Image, { StaticImageData } from "next/image"; // Import Image from Next.js
import { useAppSelector } from "@/redux/hooks";
import { useGetUserByIdQuery, useUpdateProfileInfoMutation } from "@/redux/features/api/authApi";
import Loading from "../Shared/Loading";
import toast from "react-hot-toast";

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
}
interface IUser {
    id: string;
    name: string;
    image: string | StaticImageData;
    follower: string[];
    email: string,
    firstName: string;
    lastName?: string;
    profileImage?: string;
    coverImage?: string;
}

export default function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
    const currentUser: Partial<IUser> = useAppSelector((state) => state.auth.user);
    const { data: updatedUserData, isLoading: updatedUserDataLoading } = useGetUserByIdQuery(currentUser.id as string,{skip:!currentUser?.id})
    const [ firstName, setFirstName ] = useState<string>((updatedUserData?.data as Partial<IUser>).firstName || "");
    const [ lastName, setLastName ] = useState<string>((updatedUserData?.data as Partial<IUser>).lastName || "");
    const [ profileImage, setProfileImage ] = useState<File | null>(null);
    const [ coverImage, setCoverImage ] = useState<File | null>(null);
    const [ profileImagePreview, setProfileImagePreview ] = useState<string | null>((updatedUserData?.data as Partial<IUser>).profileImage || null);
    const [ coverImagePreview, setCoverImagePreview ] = useState<string | null>((updatedUserData?.data as Partial<IUser>).coverImage || null);

    const [ updateProfile, { isLoading: updateProfileLoading } ] = useUpdateProfileInfoMutation();






    if (updatedUserDataLoading) {
        return <Loading />
    }
    const user: IUser = updatedUserData?.data;




    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        const updateProfileToastLoading = toast.loading("Updating Profile Information.Please wait.")
        try {
            const formData = new FormData();

            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            if (profileImage) formData.append("profileImage", profileImage);
            if (coverImage) formData.append("coverImage", coverImage);

            // formData.forEach((value, key) => {
            // });
            const response = await updateProfile({ data: formData, userId: user.email })
            if (response?.error) {
                toast.error("Failed to update profile information! Try again.")
                return;
            }
            toast.success("Profile information updated successfully!")
            onClose();
        } catch (error) {
        } finally {
            toast.dismiss(updateProfileToastLoading)
        }
    };

    // handle image changes
    const handleImageChange = (
        e: ChangeEvent<HTMLInputElement>,
        setImage: React.Dispatch<React.SetStateAction<File | null>>,
        setPreview: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        const file = e.target.files?.[ 0 ] || null;
        setImage(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    if (!isOpen) return null;




    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-[#1a1a1a] text-white rounded-lg p-8 w-[90%] max-w-3xl shadow-lg">
                {/* Close Button */}
                <button
                    disabled={updateProfileLoading}
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                <h2 className="text-3xl font-bold mb-6 text-center">Edit Profile</h2>

                {/* Cover Image Section */}
                <div className="relative mb-6">
                    <div className="h-40 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                        {coverImagePreview ? (
                            <Image
                                src={coverImagePreview}
                                alt="Cover Preview"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                            />
                        ) : (
                            <ImageIcon className="text-gray-500 w-16 h-16" />
                        )}
                    </div>
                    <label htmlFor="coverImageInput" className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
                        <Camera className="text-white" />
                        <input
                            id="coverImageInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e, setCoverImage, setCoverImagePreview)}
                        />
                    </label>
                </div>

                {/* Profile Image Section */}
                <div className="relative mb-6 flex justify-center">
                    <div className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden border-4 border-[#1a1a1a] flex items-center justify-center">
                        {profileImagePreview ? (
                            <Image
                                src={profileImagePreview}
                                alt="Profile Preview"
                                width={128}
                                height={128}
                                className="rounded-full h-full w-full object-cover"
                            />
                        ) : (
                            <ImageIcon className="text-gray-500 w-12 h-12" />
                        )}
                    </div>
                    <label htmlFor="profileImageInput" className="absolute bottom-0 transform translate-y-1/2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
                        <Camera className="text-white" />
                        <input
                            id="profileImageInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e, setProfileImage, setProfileImagePreview)}
                        />
                    </label>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded-md"
                        />
                    </div>

                    {/* Save and Cancel Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
