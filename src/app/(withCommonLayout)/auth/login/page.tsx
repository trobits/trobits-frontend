/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { setUser } from "@/redux/features/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  useGetUserByIdQuery,
  useLoginUserMutation,
  useVerifyOtpMutation,
} from "@/redux/features/api/authApi";
import AnimatedButton from "@/components/Shared/AnimatedButton";
import Link from "next/link";

interface ILoginInfo {
  email: string;
  password: string;
}

export default function Login() {
  const [loginMutation, { isLoading: loginLoading }] = useLoginUserMutation();
  const [verifyOtpMutation, { isLoading: verifyAccountLoading }] = useVerifyOtpMutation();
  const initialState: ILoginInfo = { email: "", password: "" };

  const [showPassword, setShowPassword] = useState(false);
  const [loginInfo, setLoginInfo] = useState(initialState);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data: userFromDb } = useGetUserByIdQuery(user?.id || null, { skip: !user?.id });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginLoadingToast = toast.loading("Logging in user...");

    try {
      const response = await loginMutation(loginInfo);

      if (response.error && (response as any).error.data) {
        const errorMessage = (response as any).error.data.message;
        if (errorMessage.includes("User not verified")) {
          setShowOTPModal(true);
          toast.error(errorMessage);
          return;
        }
        toast.error(errorMessage);
        return;
      }

      dispatch(setUser(response?.data?.data));
      localStorage.setItem("refreshToken", response?.data?.token?.refreshToken);
      localStorage.setItem("accessToken", response?.data?.token?.accessToken);
      router.push("/");
      toast.success("Successfully logged in!");
    } finally {
      toast.dismiss(loginLoadingToast);
    }
  };

  const handleOtpVerify = async () => {
    if (!otp || otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP.");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await verifyOtpMutation({ email: loginInfo.email, otp });
      if (response.error) {
        toast.error("Invalid OTP. Please try again.");
      } else {
        toast.success("Email verified successfully!");
        setShowOTPModal(false);
        dispatch(setUser(response?.data?.data));
        localStorage.setItem("refreshToken", response?.data?.token?.refreshToken);
        router.push("/");
      }
    } catch {
      toast.error("Something went wrong while verifying OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  if (userFromDb && user) {
    router.push("/");
    return;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-28">
      <div className="w-full max-w-xl min-h-[600px] rounded-3xl bg-gray-900/40 border border-gray-800/50 shadow-2xl p-10 backdrop-blur-md flex flex-col justify-center text-center transition-all duration-300 hover:border-slate-500/40">
        <h2 className="text-4xl font-bold text-white mb-2 pb-8">Welcome Back</h2>
        <p className="text-base text-gray-400 mb-8">Log in to access your dashboard.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="mx-auto w-4/5">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={loginInfo.email}
              onChange={handleValueChange}
              required
              className="text-black bg-white"
            />
          </div>

          <div className="relative mx-auto w-4/5">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={loginInfo.password}
              onChange={handleValueChange}
              minLength={6}
              required
              className="text-black bg-white pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black hover:bg-transparent"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>

          <div className="mx-auto w-4/5">
            <AnimatedButton
              type="submit"
              loading={loginLoading}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white"
            >
              {loginLoading ? "Processing..." : "Login"}
            </AnimatedButton>
          </div>
        </form>

        <div className="mt-4 text-sm mx-auto w-4/5 text-left">
          <Link href="/auth/forgotPassword" className="text-cyan-300 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <p className="mt-4 text-center text-sm text-white">
          Don't have an account?{' '}
          <Link href="/auth/signin" className="text-cyan-300 hover:underline">
            Sign Up here
          </Link>
        </p>
      </div>

      {showOTPModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-96">
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
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setShowOTPModal(false)}
                  className="bg-gray-600 text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleOtpVerify}
                  className="bg-cyan-600 text-white"
                  disabled={otpLoading}
                >
                  {otpLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
