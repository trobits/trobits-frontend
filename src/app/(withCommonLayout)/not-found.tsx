"use client";

import React from "react";
import Link from "next/link";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100">
            {/* Animated 404 Text */}
            <div className="text-center">
                <h1 className="text-9xl font-extrabold text-blue-600 animate-bounce">404</h1>
                <p className="text-2xl font-semibold text-gray-800 mt-4">
                    Page Not Found
                </p>
                <p className="text-gray-600 mt-2">
                    Sorry, we couldn&apos;t find the page you  are looking for.
                </p>
            </div>

            {/* Animated Illustration */}
            <div className="relative mt-10">
                <div className="w-48 h-48 bg-blue-300 rounded-full animate-pulse"></div>
                <div className="absolute top-4 left-4 w-40 h-40 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute top-8 left-8 w-32 h-32 bg-blue-500 rounded-full animate-pulse"></div>
            </div>

            {/* Back to Home Button */}
            <div className="mt-10">
                <Link
                    href="/"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
