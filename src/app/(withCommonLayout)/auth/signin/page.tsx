/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnimatedButton from "@/components/Shared/AnimatedButton";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCreateuserMutation } from "@/redux/features/api/authApi";
import Link from "next/link";

interface ISignUpInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const [registerMutation, { isLoading: registerLoading }] = useCreateuserMutation();
  const initialState: ISignUpInfo = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const [showPassword, setShowPassword] = useState(false);
  const [signUpInfo, setSignUpInfo] = useState(initialState);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpInfo({ ...signUpInfo, [name]: value });
  };

  const validatePassword = (password: string) => {
    const strongPasswordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword(signUpInfo.password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include letters, numbers, and special characters."
      );
      return;
    }

    setPasswordError(null);
    const registerLoadingToast = toast.loading("Creating your account...");

    try {
      const response = await registerMutation(signUpInfo);
      if (response.error) {
        const errorMessage = (
          response?.error as { data?: { message?: string } }
        ).data?.message;
        toast.error(errorMessage || "Something went wrong while signing up!");
        return;
      }
      toast.success("Successfully signed up!");
      router.push("/auth/login");
    } finally {
      toast.dismiss(registerLoadingToast);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-28">
      <div className="w-full max-w-xl min-h-[650px] rounded-3xl bg-gray-900/40 border border-gray-800/50 shadow-2xl p-10 backdrop-blur-md flex flex-col justify-center text-center transition-all duration-300 hover:border-slate-500/40">
        <h2 className="text-4xl font-bold text-white mb-2 pb-8">Create an Account</h2>
        <p className="text-base text-gray-400 mb-8">Fill out the form below to sign up.</p>

        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="mx-auto w-4/5">
            <Input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={signUpInfo.firstName}
              onChange={handleValueChange}
              required
              className="text-black bg-white"
            />
          </div>

          <div className="mx-auto w-4/5">
            <Input
              type="text"
              name="lastName"
              placeholder="User Name"
              value={signUpInfo.lastName}
              onChange={handleValueChange}
              required
              className="text-black bg-white"
            />
          </div>

          <div className="mx-auto w-4/5">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={signUpInfo.email}
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
              value={signUpInfo.password}
              onChange={handleValueChange}
              required
              minLength={8}
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

          {passwordError && (
            <p className="text-red-500 text-xs -mt-2">{passwordError}</p>
          )}

          <div className="mx-auto w-4/5">
            <AnimatedButton
              type="submit"
              loading={registerLoading}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white"
            >
              {registerLoading ? "Creating Account..." : "Sign Up"}
            </AnimatedButton>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-white">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-cyan-300 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
