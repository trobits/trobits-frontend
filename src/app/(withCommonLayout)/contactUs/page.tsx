

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useContactUsMutation } from "@/redux/features/api/authApi";
import { FaFacebookF, FaTwitter, FaReddit, FaYoutube, FaTiktok, FaLinkedin, FaInstagram, FaTelegram } from "react-icons/fa";
import Link from "next/link";

export default function ContactUs() {
    const [ name, setName ] = useState(""); // Added name state
    const [ email, setEmail ] = useState(""); // For capturing the email
    const [ subject, setSubject ] = useState("");
    const [ message, setMessage ] = useState("");
    const [ sendEmail, { isLoading: sendEmailLoading } ] = useContactUsMutation();

    // Handle name change
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    // Handle email change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    // Handle subject change
    const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubject(e.target.value);
    };

    // Handle message change
    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const sendEmailLoadingToast = toast.loading("Message is sending...");
        try {
            const response = await sendEmail({
                name: name, // Include name in the request
                email: email,
                subject: subject,
                message: message,
            });
            if (response.error) {
                const errorMessage = (response as { error: { data: { message: string } } }).error.data.message || "Failed to send email!";
                toast.error(errorMessage);
                return;
            }
            toast.success("Your message has been sent!");
            setName(""); // Clear the name field
            setEmail(""); // Clear the email field
            setSubject(""); // Clear the subject field
            setMessage(""); // Clear the message field
        } catch (error) {
            toast.error("Failed to send email!");
        } finally {
            toast.dismiss(sendEmailLoadingToast);
        }
    };

    return (
        <div className="h-screen bg-[#f0f0f0] py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4">Contact Us</h1>
                <p className="text-center mb-8 text-lg text-gray-600">
                    We’d love to hear from you! Please fill out the form below to get in touch with us.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Your Name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Your Name"
                                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Your Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Your Email"
                                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                Subject
                            </label>
                            <Input
                                id="subject"
                                type="text"
                                value={subject}
                                onChange={handleSubjectChange}
                                placeholder="Subject"
                                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                Your Message
                            </label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={handleMessageChange}
                                placeholder="Your message"
                                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600"
                                rows={6}
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
                        disabled={sendEmailLoading}
                    >
                        {sendEmailLoading ? "Sending..." : "Submit"}
                    </Button>
                </form>

                {/* Footer Links Section */}
                <div className="mt-8 text-center">
                    <h2 className="text-2xl font-semibold">Other ways to contact us:</h2>

                    <div className="flex justify-center gap-4 mt-4">
                        <Link href="https://www.facebook.com/profile.php?id=61564695827270" target="_blank" className="text-indigo-600 hover:text-indigo-800">
                            <FaFacebookF size={20} />
                        </Link>
                        <Link href="https://x.com/Trobits_inc" target="_blank" className="text-indigo-600 hover:text-indigo-800">
                            <FaTwitter size={20} />
                        </Link>
                        <Link href="https://www.reddit.com/user/trobits" target="_blank" className="text-indigo-600 hover:text-indigo-800">
                            <FaReddit size={20} />
                        </Link>
                        <Link href="https://www.youtube.com/@TrobitsCommunity" target="_blank" className="text-indigo-600 hover:text-indigo-800">
                            <FaYoutube size={20} />
                        </Link>
                        <Link href="https://www.tiktok.com/@trobits_community" target="_blank" className="text-indigo-600 hover:text-indigo-800">
                            <FaTiktok size={20} />
                        </Link>
                        <Link href="https://linkedin.com/company/trobits" target="_blank" className="text-indigo-600 hover:text-indigo-800">
                            <FaLinkedin size={20} />
                        </Link>
                        <Link href="https://t.me/Trobits1" target="_blank" className="text-indigo-600 hover:text-indigo-800">
                            <FaTelegram size={20} />
                        </Link>
                        <Link href="https://www.instagram.com/trobits_inc/" target="_blank" className="text-indigo-600 hover:text-indigo-800">
                            <FaInstagram size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
