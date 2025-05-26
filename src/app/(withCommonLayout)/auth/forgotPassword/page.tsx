

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation, useSetNewPasswordMutation } from "@/redux/features/api/authApi";

export default function ForgotPassword() {
    const [ email, setEmail ] = useState("");
    const [ otp, setOtp ] = useState("");
    const [ newPassword, setNewPassword ] = useState("");
    const [ sendOtpLoading, setSendOtpLoading ] = useState(false);
    const [ otpLoading, setOtpLoading ] = useState(false);
    const [ showOtpModal, setShowOtpModal ] = useState(false);
    // const [ showNewPasswordField, setShowNewPasswordField ] = useState(false); // For new password field
    const router = useRouter();

    // Mutation hooks
    const [ sendOtpMutation ] = useForgotPasswordMutation(); // Send OTP request
    const [ verifyOtpAndSetPasswordMutation ] = useSetNewPasswordMutation(); // Send OTP and new password together

    // Handle email change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    // Handle OTP change
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
    };

    // Handle new password change
    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    };

    // Step 1: Send OTP to the email
    const handleSendOtp = async () => {
        if (!email) {
            toast.error("Please enter a valid email.");
            return;
        }

        setSendOtpLoading(true);
        try {
            const response = await sendOtpMutation({ email });

            if (response.error) {
                const errorMessage = (response.error as { data: { message: string } }).data.message;
                toast.error(errorMessage || "Failed to send OTP.");
                return;
            }

            toast.success("OTP sent successfully! Check your email.");
            setShowOtpModal(true);
        } catch (error) {
            toast.error("Something went wrong while sending OTP.");
        } finally {
            setSendOtpLoading(false);
        }
    };


    const handleVerifyOtpAndSetPassword = async () => {
        if (!otp || otp.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP.");
            return;
        }

        if (!newPassword) {
            toast.error("Please enter a new password.");
            return;
        }

        setOtpLoading(true);
        try {

            const response = await verifyOtpAndSetPasswordMutation({ email, otp, password: newPassword });
            if (response.error) {
                const errorMessage = (response.error as { data: { message: string } }).data.message;
                toast.error(errorMessage || "Invalid OTP or something went wrong.");
                return;
            } else {
                toast.success("Password updated successfully!");
                router.push("/auth/login"); // Redirect to login page after success
            }
        } catch (error) {
            toast.error("Something went wrong while verifying OTP and updating password.");
        } finally {
            setOtpLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-[#0000009c]">
            {/* Forgot Password Form */}
            {!showOtpModal && (
                <div className="bg-[#01030063] text-white p-8 rounded-md w-96">
                    <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
                    <p className="text-sm mb-4">Please enter your email to receive a 4-digit OTP.</p>
                    <Input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        className="w-full p-2 mb-4 border text-black border-gray-300 rounded-md"
                    />
                    <Button
                        onClick={handleSendOtp}
                        className="w-full bg-indigo-600 text-white"
                        disabled={sendOtpLoading}
                    >
                        {sendOtpLoading ? "Sending..." : "Send OTP"}
                    </Button>
                </div>
            )}

            {/* OTP Verification Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md w-96">
                        <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
                        <p className="text-sm mb-4">Please enter the 4-digit OTP sent to your email.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm">Enter OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    maxLength={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    placeholder="Enter new password"
                                    minLength={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    onClick={() => setShowOtpModal(false)}
                                    className="bg-gray-400 text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleVerifyOtpAndSetPassword}
                                    className="bg-indigo-600 text-white"
                                    disabled={otpLoading}
                                >
                                    {otpLoading ? "Verifying..." : "Verify OTP and Set New Password"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
