"use client";

import React, { useState } from "react";

const ContactUs = () => {
    const [ form, setForm ] = useState({ name: "", email: "", message: "" });
    const [ successMessage, setSuccessMessage ] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [ e.target.name ]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Example form submission logic

        // Show success message
        setSuccessMessage("Your message has been sent successfully!");
        setForm({ name: "", email: "", message: "" });

        // Simulate API call (you can integrate a real API)
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6 flex items-center justify-center">
            <div className="max-w-4xl bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
                    Contact Us
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Have questions? We&apos;d love to hear from you. Fill out the form below and
                    we’ll get back to you as soon as possible.
                </p>

                {successMessage && (
                    <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-gray-700 font-medium">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={4}
                            value={form.message}
                            onChange={handleChange}
                            required
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactUs;
