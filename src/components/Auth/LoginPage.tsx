'use client'

import { ChangeEvent, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, XIcon } from "lucide-react"
import { useRouter } from 'next/navigation'
import { setUser } from '@/redux/features/slices/authSlice'
import { useAppDispatch } from '@/redux/hooks'
import toast from 'react-hot-toast'



interface ILoginInfo {
    email: string;
    password: string
}
export default function LoginPage() {
    const initialState: ILoginInfo = {
        email: 'nasir@gmail.com',
        password: '11111111'
    }
    const [ isOpen, setIsOpen ] = useState(true)
    const [ showPassword, setShowPassword ] = useState(false)
    const [ loginInfo, setLoginInfo ] = useState(initialState)
    const dispatch = useAppDispatch();
    const router = useRouter();
    // handle close modal
    const closeModal = () => {
        // if user not log in and want to go back then push to the previous route
        router.back();
        // close login page modal
        setIsOpen(false)
    }
    // show and hide password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    // set value on onchange
    const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setLoginInfo({ ...loginInfo, [ name ]: value })
    }
    // handle login logic
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(setUser(loginInfo))
        toast.success("Successfully logged in")
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient bg-[#161b1a] p-4 z-50">
            <Card className="w-full max-w-md bg-white text-gray-800 relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    onClick={closeModal}
                >
                    <XIcon className="h-6 w-6 bg-red-500 text-white rounded" />
                    <span className="sr-only">Close</span>
                </Button>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                    <p className="text-center text-sm text-gray-600">
                        Fill out the information below to access your account.
                    </p>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <Input
                                type="email"
                                name='email'
                                id='email'
                                placeholder="Email"
                                value={loginInfo.email}
                                onChange={handleValueChange}
                                required
                                className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    name='password'
                                    id='password'
                                    minLength={8}
                                    placeholder="Password"
                                    value={loginInfo.password}
                                    onChange={handleValueChange}
                                    className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pr-20"
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
                                <span className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                    {loginInfo.password.length}/8
                                </span>
                            </div>
                        </div>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" type="submit">
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                    <div className="flex justify-between items-center w-full">
                        <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
                            Forgot Password?
                        </a>
                    </div>
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">
                                Or sign in with
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                        <svg
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fab"
                            data-icon="google"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 488 512"
                        >
                            <path
                                fill="currentColor"
                                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                            ></path>
                        </svg>
                        Continue with Google
                    </Button>
                    <p className="text-center text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <a href="#" className="text-indigo-600 hover:underline">
                            Sign Up here
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}