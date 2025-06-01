/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { Button } from '@/components/ui/button'
import React, { ReactNode, useState } from 'react'
import { FaHashtag, FaUser } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { IoMdNotifications } from 'react-icons/io';
import { MdOutlineDynamicFeed, MdLogout } from "react-icons/md";
import { BiVideo } from 'react-icons/bi';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Shared/Logo';
import { clearUser } from '@/redux/features/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';

const CryptoLayout = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const pathname = usePathname();

    const handleLogOut = () => {
        dispatch(clearUser())
        router.push('/');   
    }

    const navigationItems = [
        {
            href: '/cryptohub/cryptochat',
            icon: <FaHashtag className="w-5 h-5" />,
            label: 'CryptoChat',
            active: pathname.includes('/cryptohub/cryptochat')
        },
        {
            href: '/cryptohub/feed',
            icon: <MdOutlineDynamicFeed className="w-5 h-5" />,
            label: 'Feed',
            active: pathname.includes('/cryptohub/feed')
        },
        {
            href: '/cryptohub/videoPost',
            icon: <BiVideo className="w-5 h-5" />,
            label: 'Expert Videos',
            active: pathname.includes('/cryptohub/videoPost')
        },
        {
            href: '/cryptohub/myspot',
            icon: <FaUser className="w-5 h-5" />,
            label: 'My Spot',
            active: pathname.includes('/cryptohub/myspot')
        },
        {
            href: '/cryptohub/notifications',
            icon: <IoMdNotifications className="w-5 h-5" />,
            label: 'Notifications',
            active: pathname.includes('/cryptohub/notifications')
        }
    ];

    return (
        <div className="h-[calc(100vh-140px)] w-full fixed flex flex-col lg:flex-row bg-black">
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`lg:w-72 w-72 min-h-screen pb-10 pt-28 bg-gray-900/80 border-r border-gray-800/50 backdrop-blur-xl text-white flex flex-col fixed lg:relative z-20 lg:translate-x-0 transition-all duration-300 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Sidebar Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-black font-bold text-sm">C</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">CRYPTO HUB</h2>
                    </div>
                    
                    {/* Close button for mobile */}
                    <Button
                        className="lg:hidden p-2 hover:bg-gray-800 rounded-xl transition-colors duration-200"
                        variant="ghost"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <FiX className="w-5 h-5 text-gray-400" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-6">
                    <div className="space-y-2">
                        {navigationItems.map((item) => (
                            <Link key={item.href} href={item.href} passHref>
                                <div
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                                        transition-all duration-200 cursor-pointer group
                                        ${item.active 
                                            ? 'bg-white text-black shadow-lg' 
                                            : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                                        }
                                    `}
                                >
                                    <div className={`
                                        transition-transform duration-200 group-hover:scale-110
                                        ${item.active ? 'text-black' : 'text-gray-400 group-hover:text-white'}
                                    `}>
                                        {item.icon}
                                    </div>
                                    <span className="text-sm">{item.label}</span>
                                    
                                    {item.active && (
                                        <div className="ml-auto w-2 h-2 bg-black rounded-full"></div>
                                    )}
                                </div>
                            </Link>
                        ))}
                        
                        {/* Logout Button */}
                        <div className="pt-4 mt-4 border-t border-gray-800/50">
                            <div
                                onClick={handleLogOut}
                                className="
                                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                                    text-gray-300 hover:bg-red-600/10 hover:text-red-400
                                    transition-all duration-200 cursor-pointer group
                                "
                            >
                                <MdLogout className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                                <span className="text-sm">Logout</span>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Footer/Logo Section */}
                <div className="p-6 border-t border-gray-800/50">
                    <div className="flex justify-center">
                        <Logo />
                    </div>
                </div>
            </aside>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
                <Button
                    className={`
                        fixed top-4 left-4 z-30 bg-gray-900/80 border border-gray-800/50 backdrop-blur-xl
                        text-white rounded-xl px-4 py-3 shadow-lg hover:bg-gray-800/80
                        transition-all duration-200 hover:scale-105
                        ${isSidebarOpen ? 'hidden' : 'flex items-center gap-2'}
                    `}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <FiMenu className="w-5 h-5" />
                    <span className="text-sm font-medium">Menu</span>
                </Button>
            </div>

            {/* Main Content */}
            <main className="flex-1 min-h-screen overflow-y-auto bg-black">
                <div className="min-h-full p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CryptoLayout;