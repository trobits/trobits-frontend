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
  const [registerMutation, { isLoading: registerLoading }] =
    useCreateuserMutation();
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        "Password should be at least 8 characters long and include a mix of letters, numbers, and special characters."
      );
      return;
    }

    setPasswordError(null);
    const registerLoadingToast = toast.loading("Creating your account...");

    try {
      const response = await registerMutation(signUpInfo);
      if (response.error) {
        const errorMessage = (
          response?.error as {
            data?: { message?: string };
          }
        ).data?.message;
        toast.error(
          errorMessage || "Something went wrong while signing up! Try again."
        );
        return;
      }
      toast.success("Successfully signed up!");
      router.push("/auth/login");
    } catch (error: any) {
    } finally {
      toast.dismiss(registerLoadingToast);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl min-h-[650px] rounded-3xl border border-cyan-400/20 bg-[#00000090] shadow-2xl p-10 backdrop-blur-md flex flex-col px-20 justify-center text-center">
        <h2 className="text-center text-4xl font-bold text-cyan-300 mb-2 pb-8">
          Create an Account
        </h2>
        <p className="text-center text-white text-base mb-8">
          Fill out the information below to sign up.
        </p>

        <form className="space-y-5 w-full" onSubmit={handleSignUp}>
          <Input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={signUpInfo.firstName}
            onChange={handleValueChange}
            required
            className="text-black"
          />
          <Input
            type="text"
            name="lastName"
            placeholder="User Name"
            value={signUpInfo.lastName}
            onChange={handleValueChange}
            className="text-black"
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={signUpInfo.email}
            onChange={handleValueChange}
            required
            className="text-black"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={signUpInfo.password}
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
            <span className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-gray-300">
              {signUpInfo.password.length}/8
            </span>
          </div>

          {passwordError && (
            <p className="text-red-500 text-xs -mt-2">{passwordError}</p>
          )}

          <AnimatedButton
            type="submit"
            loading={registerLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            {registerLoading ? "Creating Account..." : "Sign Up"}
          </AnimatedButton>
        </form>

        <p className="mt-6 text-center text-sm text-white">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-cyan-300 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
