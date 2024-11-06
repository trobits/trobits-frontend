/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { Button } from '@/components/ui/button'
import React, { ReactNode, useState } from 'react'
import { FaHashtag, FaUser } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { IoMdNotifications } from 'react-icons/io';
import { MdOutlineDynamicFeed } from "react-icons/md";
import { GrLogin } from "react-icons/gr";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Shared/Logo';
import { clearUser } from '@/redux/features/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import toast from 'react-hot-toast';


const CryptoLayout = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [ isSidebarOpen, setIsSidebarOpen ] = useState<boolean>(false);
    const pathname = usePathname();

    const handleLogOut = () => {
        dispatch(clearUser())
        router.push('/');   
    }

    return (
        <div className="h-[calc(100vh-130px)] w-full fixed flex flex-col lg:flex-row bg-transparent rounded-b-md">
            {/* Fixed Sidebar */}
            <aside
                className={`lg:w-64 w-64 h-full bg-[#000000b9] shadow-black text-gray-200 flex flex-col shadow-lg fixed lg:relative z-20 lg:translate-x-0 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-700 rounded-t-lg">

                    {/* Close button for mobile */}
                    <Button
                        className="lg:hidden text-white bg-red-500 px-4"
                        variant="ghost"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        ✕
                    </Button>
                </div>
                {/* Sidebar Header */}
                <div className="flex justify-between items-center p-6">
                    <h2 className="text-lg font-bold text-white">CRYPTO HUB</h2>
                </div>

                {/* Navigation */}
                <nav className="w-full p-4">
                    <ul className="space-y-4">
                        <li>
                            <Link href="/cryptohub/cryptochat" passHref>
                                <Button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-teal-400 transition-colors ${pathname.includes('/cryptohub/cryptochat') ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300'
                                        }`}
                                >
                                    <FaHashtag className=' mr-2' />
                                    CryptoChat
                                </Button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/cryptohub/feed" passHref>
                                <Button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-teal-400 transition-colors ${pathname.includes('/cryptohub/feed') ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300'
                                        }`}
                                >
                                    <MdOutlineDynamicFeed className=' mr-2' />
                                    Feed
                                </Button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/cryptohub/myspot" passHref>
                                <Button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-teal-400 transition-colors ${pathname.includes('/cryptohub/myspot') ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300'
                                        }`}
                                >
                                    <FaUser className=' mr-2' />
                                    My Spot
                                </Button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/cryptohub/notifications" passHref>
                                <Button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-teal-400 transition-colors ${pathname.includes('/cryptohub/notifications') ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300'
                                        }`}
                                >
                                    <IoMdNotifications className='mr-2' />
                                    Notifications
                                </Button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/" passHref>
                                <Button
                                    onClick={handleLogOut}
                                    className="w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-teal-400  text-white transition-colors"
                                >
                                    <GrLogin className='mr-2' />
                                    Logout
                                </Button>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Footer/Logo Section */}
                <div className='flex flex-col flex-grow lg:justify-end mb-16'>
                    <Logo />
                </div>
            </aside>

            {/* Sidebar Toggle Button for Mobile */}
            <div className="lg:hidden flex justify-start p-4">
                <Button
                    className={`bg-teal-600 ${isSidebarOpen ? "hidden" : ""} text-white rounded-lg px-5`}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <FiMenu size={24} />
                </Button>
            </div>

            {/* Main Content */}
            <main className="flex-1 ml-2 h-full overflow-y-auto p-4">
                {children}
            </main>
        </div>
    );
}

export default CryptoLayout;
