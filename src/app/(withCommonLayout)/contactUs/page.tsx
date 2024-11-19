/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // You might need a Textarea component
import toast from "react-hot-toast";
import AuthGuard from "@/components/Auth/AuthGuard";
import { useAppSelector } from "@/redux/hooks";
import { useContactUsMutation } from "@/redux/features/api/authApi";
import { User } from "../cryptohub/videoPost/page";

export default function ContactUs() {
    const [ subject, setSubject ] = useState("");
    const [ message, setMessage ] = useState("");
    const user: User = useAppSelector((state) => state.auth.user);
    const [ sendEmail, { isLoading: sendEmailLoading } ] = useContactUsMutation();

    console.log({ user })

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
        const sendEmailLoadingToast = toast.loading("Message is sending...")
        try {
            const messageSubject = subject;
            const messageBody = message;
            const response = await sendEmail({
                name: user.firstName + " " + user.lastName,
                email: user.email,
                subject: messageSubject,
                message: messageBody,
            });
            if (response.error) {
                const errorMessage = (response as { error: { data: { message: string } } }).error.data.message || "Failed to send email!"
                toast.error(errorMessage);
                return;
            }
            toast.success("Your message has been sent!");

            setSubject("");
            setMessage("");
        } catch (error) {
            toast.error("Failed to send email!")
        } finally {
            toast.dismiss(sendEmailLoadingToast)
        }
    };

    return (
        <AuthGuard>
            <div className="h-screen bg-[#f0f0f0] py-8 px-4">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-lg">
                    <h1 className="text-3xl font-bold text-center mb-4">Contact Us</h1>

                    <p className="text-center mb-8 text-lg text-gray-600">
                        We’d love to hear from you! Please fill out the form below to get in touch with us.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                type="text"
                                value={subject}
                                onChange={handleSubjectChange}
                                placeholder="Subject"
                                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600"
                                required
                            />
                            <Textarea
                                value={message}
                                onChange={handleMessageChange}
                                placeholder="Your message"
                                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600"
                                rows={6}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
                        >
                            Submit
                        </Button>
                    </form>

                    {/* <div className="mt-8 text-center">
                    <h2 className="text-2xl font-semibold">Other ways to contact us:</h2>
                    <p className="text-lg text-gray-600 mt-2">
                        Email: <a href="mailto:info@yourwebsite.com" className="text-indigo-600">info@yourwebsite.com</a>
                    </p>
                    <p className="text-lg text-gray-600 mt-2">
                        Phone: <a href="tel:+1234567890" className="text-indigo-600">+1 (234) 567-890</a>
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                        <a href="https://facebook.com/yourpage" className="text-indigo-600 hover:text-indigo-800">
                            Facebook
                        </a>
                        <a href="https://twitter.com/yourprofile" className="text-indigo-600 hover:text-indigo-800">
                            Twitter
                        </a>
                        <a href="https://linkedin.com/in/yourprofile" className="text-indigo-600 hover:text-indigo-800">
                            LinkedIn
                        </a>
                    </div>
                </div> */}
                </div>
            </div>
        </AuthGuard>
    );
}
