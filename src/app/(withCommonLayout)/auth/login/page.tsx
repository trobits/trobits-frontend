
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'
import { ChangeEvent, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { setUser } from '@/redux/features/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useGetUserByIdQuery, useLoginUserMutation, useVerifyOtpMutation } from '@/redux/features/api/authApi'
import AnimatedButton from '@/components/Shared/AnimatedButton'
import Link from 'next/link'

interface ILoginInfo {
  email: string;
  password: string
}

export default function Login() {
  const [ loginMutation, { isLoading: loginLoading } ] = useLoginUserMutation();
  const [ verifyOtpMutation, { isLoading: verifyAccountLoading } ] = useVerifyOtpMutation();
  const initialState: ILoginInfo = {
    email: '',
    password: ''
  };
  const [ showPassword, setShowPassword ] = useState(false);
  const [ loginInfo, setLoginInfo ] = useState(initialState);
  const [ showOTPModal, setShowOTPModal ] = useState(false);
  const [ otp, setOtp ] = useState("");
  const [ otpLoading, setOtpLoading ] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data: userFromDb, isLoading: userFromDbLoading } = useGetUserByIdQuery(user?.id || null);

  // Show and hide password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Set value on input change
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [ name ]: value });
  };

  // Handle OTP input change
  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  // Handle login logic
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginLoadingToast = toast.loading("Logging in user...");
    try {
      const response = await loginMutation(loginInfo);
      console.log({ response });

      // Check if response contains OTP verification error message
      if (response.error && (response as { error: { data: { message: string } } }).error.data) {
        const errorMessage = (response as { error: { data: { message: string } } }).error.data.message;;
        if (errorMessage === "User not verified. Please check your email for OTP verification.") {
          // Show OTP verification modal
          setShowOTPModal(true);
          toast.error(errorMessage);
          return;
        }
      }

      // Handle other errors
      if (response.error) {
        const errorMessage = (response as { error: { data: { message: string } } }).error.data.message || "Something went wrong during login!";
        toast.error(errorMessage);
        return;
      }

      // Handle successful login
      dispatch(setUser(response?.data?.data));
      localStorage.setItem("refreshToken", response?.data?.token?.refreshToken);
      router.push("/");
      toast.success("Successfully logged in!");
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(loginLoadingToast);
    }
  };

  // Handle OTP verification
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
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Something went wrong while verifying OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Redirect to home if user is already logged in
  if (userFromDb && user) {
    router.push("/");
    return;
  }

  return (
    <div className="h-[calc(100vh-98px)]">
      <div className='h-full bg-[#0000009c]'>
        <div className="flex pt-16 justify-center  p-4 z-40">
          <Card className="w-full max-w-lg bg-[#01030063]  text-white relative z-50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <p className="text-center text-sm text-white">
                Fill out the information below to access your account.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-4 text-white" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Input
                    type="email"
                    name='email'
                    id='email'
                    placeholder="Email"
                    value={loginInfo.email}
                    onChange={handleValueChange}
                    required
                    className="rounded-md text-black border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      name='password'
                      id='password'
                      minLength={6}
                      placeholder="Password"
                      value={loginInfo.password}
                      onChange={handleValueChange}
                      className="rounded-md text-black border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pr-20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                </div>
                <AnimatedButton type='submit' loading={loginLoading} className="w-full bg-indigo-600 text-white">
                  {loginLoading ? "Processing..." : "Submit"}
                </AnimatedButton>
              </form>
            </CardContent>

            <CardFooter className="flex-col space-y-4">
              <div className="flex justify-between items-center w-full">
                <Link href="/auth/forgotPassword" className="text-sm text-indigo-600 hover:text-indigo-800">
                  Forgot Password?
                </Link>
              </div>


              <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signin" className="text-indigo-600 hover:underline">
                  Sign Up here
                </Link>
              </p>
            </CardFooter>

          </Card>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md w-96">
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
                  className="bg-indigo-600 text-white"
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
