"use client";
import { useState, FormEvent, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks";
import { useGetUserByIdQuery } from "@/redux/features/api/authApi";

interface ClaimsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// List of affiliate marketing partners
const AFFILIATE_OPTIONS = [
    'Testerup',
    'TikTok',
    'Social Catfish',
    'NEXO',
    'NordVPN',
    'Coinbase',
    'Gemini',
    'Stock Market Guides',
    'Fanatics',
    'Remitly'
];

interface ClaimsFormData {
    email: string;
    affiliateName: string;
    dateCompleted: string;
    city: string;
    value: string;
}

export default function ClaimsModal({ isOpen, onClose }: ClaimsModalProps) {
    const user = useAppSelector((state) => state.auth.user);
    const {
        data: userFromDbData,
        isLoading: userFromDbLoading,
    } = useGetUserByIdQuery(user?.id, { skip: !user?.id });
    const userFromDb = userFromDbData?.data;

    const [formData, setFormData] = useState<ClaimsFormData>({
        email: "",
        affiliateName: "",
        dateCompleted: "",
        city: "",
        value: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-fill form when modal opens or user data changes
    useEffect(() => {
        if (isOpen && userFromDb) {
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            setFormData({
                email: userFromDb.email || "",
                affiliateName: "", // Keep empty for user selection
                dateCompleted: today,
                city: "", // Keep empty as we don't have user's city
                value: ""
            });
        }
    }, [isOpen, userFromDb]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const submitToastLoading = toast.loading("Submitting claim...");

        try {
            const response = await fetch('/api/claims', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit claim');
            }

            toast.success("Claim submitted successfully!");
            
            // Reset form with auto-filled values
            const today = new Date().toISOString().split('T')[0];
            setFormData({
                email: userFromDb?.email || "",
                affiliateName: "",
                dateCompleted: today,
                city: "",
                value: ""
            });
            
            onClose();
        } catch (error) {
            toast.error("Failed to submit claim. Please try again.");
            console.error("Error submitting claim:", error);
        } finally {
            setIsSubmitting(false);
            toast.dismiss(submitToastLoading);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-[#1a1a1a] text-white rounded-lg p-8 w-[90%] max-w-md shadow-lg">
                {/* Close Button */}
                <button
                    disabled={isSubmitting}
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    Submit Claim
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Email <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                            required
                            disabled={isSubmitting}
                            placeholder="Email will be auto-filled from your account"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Name of Affiliate <span className="text-red-400">*</span>
                        </label>
                        <select
                            name="affiliateName"
                            value={formData.affiliateName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                            required
                            disabled={isSubmitting}
                        >
                            <option value="">Select affiliate partner...</option>
                            {AFFILIATE_OPTIONS.map((affiliate) => (
                                <option key={affiliate} value={affiliate}>
                                    {affiliate}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Date Completed <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="date"
                            name="dateCompleted"
                            value={formData.dateCompleted}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                            required
                            disabled={isSubmitting}
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            City <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Value <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="value"
                            value={formData.value}
                            onChange={handleInputChange}
                            placeholder="e.g., $100.00"
                            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Submit and Cancel Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Claim"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}