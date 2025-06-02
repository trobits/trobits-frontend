/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const [verifyOtpMutation, { isLoading: verifyAccountLoading }] =
    useVerifyOtpMutation();
  const initialState: ILoginInfo = {
    email: "",
    password: "",
  };
  const [showPassword, setShowPassword] = useState(false);
  const [loginInfo, setLoginInfo] = useState(initialState);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data: userFromDb, isLoading: userFromDbLoading } =
    useGetUserByIdQuery(user?.id || null, { skip: !user?.id });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginLoadingToast = toast.loading("Logging in user...");
    try {
      const response = await loginMutation(loginInfo);

      if (
        response.error &&
        (response as { error: { data: { message: string } } }).error.data
      ) {
        const errorMessage = (
          response as { error: { data: { message: string } } }
        ).error.data.message;
        if (
          errorMessage ===
          "User not verified. Please check your email for OTP verification."
        ) {
          setShowOTPModal(true);
          toast.error(errorMessage);
          return;
        }
      }

      if (response.error) {
        const errorMessage =
          (response as { error: { data: { message: string } } }).error.data
            .message || "Something went wrong during login!";
        toast.error(errorMessage);
        return;
      }

      dispatch(setUser(response?.data?.data));
      localStorage.setItem("refreshToken", response?.data?.token?.refreshToken);
      localStorage.setItem("accessToken", response?.data?.token?.accessToken);
      router.push("/");
      toast.success("Successfully logged in!");
    } catch (error) {
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
        localStorage.setItem(
          "refreshToken",
          response?.data?.token?.refreshToken
        );
      }
    } catch (error) {
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
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl min-h-[600px] rounded-3xl border border-cyan-400/20 bg-[#00000090] shadow-2xl p-10 backdrop-blur-md flex flex-col px-20 justify-center text-center">
        <h2 className="text-center text-4xl font-bold text-cyan-300 mb-2 pb-8">
          Welcome Back
        </h2>
        <p className="text-center text-white text-base mb-8">
          Log in to access your dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={loginInfo.email}
            onChange={handleValueChange}
            required
            className="text-black"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={loginInfo.password}
              onChange={handleValueChange}
              minLength={6}
              required
              className="text-black pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>

          <AnimatedButton
            type="submit"
            loading={loginLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            {loginLoading ? "Processing..." : "Login"}
          </AnimatedButton>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <Link
            href="/auth/forgotPassword"
            className="text-cyan-300 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <p className="mt-4 text-center text-sm text-white">
          Don't have an account?{" "}
          <Link href="/auth/signin" className="text-cyan-300 hover:underline">
            Sign Up here
          </Link>
        </p>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
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
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setShowOTPModal(false)}
                  className="bg-gray-400 text-white"
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
