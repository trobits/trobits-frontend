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
      toast.error(
        "Something went wrong while verifying OTP and updating password."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center px-4">
      {!showOtpModal && (
        <div className="w-full max-w-lg min-h-[400px] rounded-3xl border border-cyan-400/20 bg-[#00000090] shadow-2xl p-10 backdrop-blur-md flex flex-col px-10 justify-center text-center">
          <h2 className="text-center text-3xl font-bold text-cyan-300 mb-2 pb-4">
            Forgot Password
          </h2>
          <p className="text-center text-white text-base mb-6">
            Enter your email to receive a 4-digit OTP.
          </p>
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="text-black"
          />
          <Button
            onClick={handleSendOtp}
            className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            disabled={sendOtpLoading}
          >
            {sendOtpLoading ? "Sending..." : "Send OTP"}
          </Button>
        </div>
      )}

      {showOtpModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
            <p className="text-sm mb-4">
              Please enter the 4-digit OTP sent to your email.
            </p>
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
              <div>
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
