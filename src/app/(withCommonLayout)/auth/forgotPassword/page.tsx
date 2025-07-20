/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  useForgotPasswordMutation,
  useSetNewPasswordMutation,
} from "@/redux/features/api/authApi";
import { ArrowLeftIcon } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const router = useRouter();

  const [sendOtpMutation] = useForgotPasswordMutation();
  const [verifyOtpAndSetPasswordMutation] = useSetNewPasswordMutation();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setOtp(e.target.value);
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewPassword(e.target.value);

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter a valid email.");

    setSendOtpLoading(true);
    try {
      const response = await sendOtpMutation({ email });
      if (response.error) {
        const errorMessage = (response.error as { data: { message: string } })
          .data.message;
        toast.error(errorMessage || "Failed to send OTP.");
        return;
      }
      toast.success("OTP sent successfully! Check your email.");
      setShowOtpModal(true);
    } catch {
      toast.error("Something went wrong while sending OTP.");
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleVerifyOtpAndSetPassword = async () => {
    if (!otp || otp.length !== 4)
      return toast.error("Please enter a valid 4-digit OTP.");
    if (!newPassword) return toast.error("Please enter a new password.");

    setOtpLoading(true);
    try {
      const response = await verifyOtpAndSetPasswordMutation({
        email,
        otp,
        password: newPassword,
      });
      if (response.error) {
        const errorMessage = (response.error as { data: { message: string } })
          .data.message;
        toast.error(errorMessage || "Invalid OTP or something went wrong.");
        return;
      }
      toast.success("Password updated successfully!");
      router.push("/auth/login");
    } catch {
      toast.error("Something went wrong while verifying OTP and updating password.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-28">
      {!showOtpModal && (
        <div className="w-full max-w-xl min-h-[550px] rounded-3xl bg-gray-900/40 border border-gray-800/50 shadow-2xl p-10 backdrop-blur-md flex flex-col justify-center text-center transition-all duration-300 hover:border-slate-500/40 relative">
          {/* Go Back Button (only here) */}
          <button
            type="button"
            className="absolute left-6 top-6 text-white text-sm px-3 py-1.5 rounded-lg backdrop-blur-md bg-gradient-to-r from-slate-600/50 to-slate-700/50 hover:from-slate-500/50 hover:to-slate-600/50 transition-all flex items-center"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Go Back
          </button>

          <h2 className="text-4xl font-bold text-white mb-2 pb-8">Forgot Password</h2>
          <p className="text-base text-gray-400 mb-8">
            Enter your email to receive a 4-digit OTP.
          </p>

          <div className="mx-auto w-4/5">
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="text-black bg-white"
            />
          </div>

          <div className="mx-auto w-4/5 mt-6">
            <Button
              onClick={handleSendOtp}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white"
              disabled={sendOtpLoading}
            >
              {sendOtpLoading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        </div>
      )}

      {showOtpModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-96 relative min-h-[400px]">
            {/* NO Go Back button here */}

            <h2 className="text-xl font-bold mb-4 text-white">Verify Your Email</h2>
            <p className="text-sm mb-4 text-gray-400">
              Please enter the 4-digit OTP sent to your email.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={4}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm text-white">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  placeholder="Enter new password"
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="bg-gray-600 text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleVerifyOtpAndSetPassword}
                  className="bg-cyan-600 text-white"
                  disabled={otpLoading}
                >
                  {otpLoading ? "Verifying..." : "Verify & Set Password"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
