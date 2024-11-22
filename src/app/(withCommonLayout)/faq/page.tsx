/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from 'react';

const faqs = [
    {
        question: "In what time zone is the site based?",
        answer: "Trobits is based in the state of Georgia, USA. We are in the Eastern Time Zone."
    },
    {
        question: "How do I create or comment on a post?",
        answer: "While anyone can use the platform to read articles, posts, and comments, we require users to create an account in order to create a post or comment on any post/article."
    },
    {
        question: "I wish to change/reset my password",
        answer: "Please use the Forgot Password link on the Signup Page."
    },
    {
        question: "How can I contribute in SHIB/LUNC burns?",
        answer: "You can be a part of the burning process simply by visiting the platform routinely. You can check crypto prices, read news articles, engage with other members of the community or simply play games. You can also help spread the word to friends and family and on social media."
    },
    {
        question: "How can I contact Trobits?",
        answer: "Please send an email to trobitscommunity@gmail.com."
    },
    // Add more FAQs as necessary
];

export default function FAQ() {
    const [ openIndex, setOpenIndex ] = useState(null);

    const toggleFAQ = (index: any) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-5">
            <h1 className="text-3xl font-bold text-center mb-8 text-white">FAQs</h1>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-300">
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full text-left flex justify-between items-center py-3 text-lg font-medium text-white transition"
                        >
                            <span>{faq.question}</span>
                            <svg
                                className={`h-5 w-5 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                    }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-screen' : 'max-h-0'
                                }`}
                        >
                            <p className="text-white py-2">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
