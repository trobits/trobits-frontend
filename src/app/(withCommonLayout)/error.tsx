"use client";

import Link from "next/link";
import React from "react";

const ErrorPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-gray-100 p-6">
            <div className="max-w-md text-center">
                <h1 className="text-6xl font-extrabold text-red-600 mb-6">Oops!</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Something went wrong.
                </h2>
                <p className="text-gray-600 mb-6">
                    We&apos;re sorry, but the page you were looking for encountered an error.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/contact"
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
