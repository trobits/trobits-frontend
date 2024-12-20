// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client'
// import { ChangeEvent, useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { EyeIcon, EyeOffIcon } from "lucide-react"
// import toast from 'react-hot-toast'
// import { useRouter } from 'next/navigation'
// import AnimatedButton from '@/components/Shared/AnimatedButton'
// import { useCreateuserMutation } from '@/redux/features/api/authApi'

// interface ISignUpInfo {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// export default function SignUp() {
//   const [ registerMutation, { isLoading: registerLoading } ] = useCreateuserMutation();
//   const initialState: ISignUpInfo = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: ''
//   }

//   const [ showPassword, setShowPassword ] = useState(false)
//   const [ signUpInfo, setSignUpInfo ] = useState(initialState)
//   const router = useRouter();

//   // show and hide password visibility
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword)
//   }

//   // set value on onchange
//   const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setSignUpInfo({ ...signUpInfo, [ name ]: value })
//   }

//   // handle sign-up logic
//   const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const registerLoadingToast = toast.loading("Creating your account...")
//     try {
//       const response = await registerMutation(signUpInfo)
//       // handle error
//       if (response.error) {
//         const errorMessage = (response?.error as { data?: { message?: string } }).data?.message
//         toast.error(errorMessage || "Something went wrong while signing up! Try again.");
//         return;
//       }
//       // handle success
//       toast.success("Successfully signed up!")
//       router.push('/auth/login');
//     } catch (error: any) {
//     } finally {
//       toast.dismiss(registerLoadingToast)
//     }
//   }

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 p-4 z-50">
//       <Card className="w-full max-w-lg bg-[#ffffffd5] text-gray-800 relative">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
//           <p className="text-center text-sm text-gray-600">
//             Fill out the information below to sign up.
//           </p>
//         </CardHeader>
//         <CardContent>
//           <form className="space-y-4" onSubmit={handleSignUp}>
//             <div className="space-y-2">
//               <Input
//                 type="text"
//                 name="firstName"
//                 id="firstName"
//                 placeholder="First Name"
//                 value={signUpInfo.firstName}
//                 onChange={handleValueChange}
//                 required
//                 className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
//               />
//             </div>
//             <div className="space-y-2">
//               <Input
//                 type="text"
//                 name="lastName"
//                 id="lastName"
//                 placeholder="Last Name"
//                 value={signUpInfo.lastName}
//                 onChange={handleValueChange}
//                 className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
//               />
//             </div>
//             <div className="space-y-2">
//               <Input
//                 type="email"
//                 name="email"
//                 id="email"
//                 placeholder="Email"
//                 value={signUpInfo.email}
//                 onChange={handleValueChange}
//                 required
//                 className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
//               />
//             </div>
//             <div className="space-y-2">
//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   required
//                   name="password"
//                   id="password"
//                   minLength={6}
//                   placeholder="Password"
//                   value={signUpInfo.password}
//                   onChange={handleValueChange}
//                   className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pr-20"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   onClick={togglePasswordVisibility}
//                 >
//                   {showPassword ? (
//                     <EyeOffIcon className="h-4 w-4" />
//                   ) : (
//                     <EyeIcon className="h-4 w-4" />
//                   )}
//                   <span className="sr-only">
//                     {showPassword ? "Hide password" : "Show password"}
//                   </span>
//                 </Button>
//                 <span className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-gray-500">
//                   {signUpInfo.password.length}/8
//                 </span>
//               </div>
//             </div>
//             <AnimatedButton type="submit" loading={registerLoading} className="w-full bg-purple-600 text-white transition-all">
//               {registerLoading ? "Creating Account..." : "Sign Up"}
//             </AnimatedButton>
//           </form>
//         </CardContent>
//         <CardFooter className="flex-col space-y-4">
//           <p className="text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <a href="/auth/login" className="text-indigo-600 hover:underline">
//               Log In
//             </a>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }








/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { ChangeEvent, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import AnimatedButton from '@/components/Shared/AnimatedButton'
import { useCreateuserMutation } from '@/redux/features/api/authApi'

interface ISignUpInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const [ registerMutation, { isLoading: registerLoading } ] = useCreateuserMutation();
  const initialState: ISignUpInfo = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  }

  const [ showPassword, setShowPassword ] = useState(false)
  const [ signUpInfo, setSignUpInfo ] = useState(initialState)
  const [ passwordError, setPasswordError ] = useState<string | null>(null);
  const router = useRouter();

  // show and hide password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // set value on onchange
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignUpInfo({ ...signUpInfo, [ name ]: value })
  }

  // Password strength validation
  const validatePassword = (password: string) => {
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  // handle sign-up logic
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the password
    if (!validatePassword(signUpInfo.password)) {
      setPasswordError("Password should be at least 8 characters long and include a mix of letters, numbers, and special characters.");
      return;
    }

    setPasswordError(null);  // Clear any previous password error
    const registerLoadingToast = toast.loading("Creating your account...")

    try {
      const response = await registerMutation(signUpInfo);
      // handle error
      if (response.error) {
        const errorMessage = (response?.error as { data?: { message?: string } }).data?.message
        toast.error(errorMessage || "Something went wrong while signing up! Try again.");
        return;
      }
      // handle success
      toast.success("Successfully signed up!")
      router.push('/auth/login');
    } catch (error: any) {
    } finally {
      toast.dismiss(registerLoadingToast)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 p-4 z-50">
      <Card className="w-full max-w-lg bg-[#ffffffd5] text-gray-800 relative">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <p className="text-center text-sm text-gray-600">
            Fill out the information below to sign up.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="space-y-2">
              <Input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                value={signUpInfo.firstName}
                onChange={handleValueChange}
                required
                className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                value={signUpInfo.lastName}
                onChange={handleValueChange}
                className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={signUpInfo.email}
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
                  name="password"
                  id="password"
                  minLength={6}
                  placeholder="Password"
                  value={signUpInfo.password}
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
                  {signUpInfo.password.length}/8
                </span>
              </div>
              {/* Show password error if password is not strong */}
              {passwordError && (
                <p className="text-red-500 text-xs">{passwordError}</p>
              )}
            </div>
            <AnimatedButton type="submit" loading={registerLoading} className="w-full bg-purple-600 text-white transition-all">
              {registerLoading ? "Creating Account..." : "Sign Up"}
            </AnimatedButton>
          </form>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/auth/login" className="text-indigo-600 hover:underline">
              Log In
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
