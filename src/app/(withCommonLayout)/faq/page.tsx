

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
        question: "I wish to change/reset my password.",
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
    {
        question: "What is Trobits?",
        answer: "Trobits is a patented idea to mobilize the community to achieve a specified goal. We provide a platform through which the community can rally and make a substantial impact on the circulating supply (and hence the price) of their beloved tokens. We use funds, generated through ads, to buy and burn the tokens."
    },
    {
        question: "What is reported as “Visits”?",
        answer: "This is the total number of times people come to our platform. Please note that if the same user comes to the platform three times a day and exits (closes) the browser after each time, it will be counted as three visits. If the same user opens the platform and it remains open the whole day, it will be counted as one visit."
    },
    {
        question: "What is reported as “Revenue”?",
        answer: "This is the amount of money that will be paid to Trobits as a result of ads being displayed on the platform. Please note that different ad agencies have different payout time frames."
    },
    {
        question: "What is reported as “Burns”?",
        answer: "This is the number of tokens that are sent to the Burn Wallets."
    },
    {
        question: "What is Crypto burning?",
        answer: "This is an IRREVERSIBLE process by which tokens are sent to a “Burn Address” (also known as a “Cruncher”). Once tokens are sent to this address, they can NEVER be recovered. They are PERMANENTLY removed from circulation. This process cannot be undone."
    },
    {
        question: "How do I verify that the burns reported are correct?",
        answer: "We provide the transaction reference for each burn. This can be verified independently through third party sites and on the blockchain."
    },
    {
        question: "When do burns occur?",
        answer: "Burns are carried out once daily at midnight EST. The goal is to eventually have the burns happen throughout the day."
    },
    {
        question: "When are Visits, Revenue and Burns data updated?",
        answer: "The data is updated every day at midnight EST. Our goal is to eventually have the data updated throughout the day."
    },
    {
        question: "Does Trobits burn other tokens?",
        answer: "No. At the moment, we burn only SHIB and LUNC tokens."
    },
    {
        question: "How do I become a Recommended Account holder?",
        answer: "Please contact us via email. Your request will be reviewed by our team."
    },
    {
        question: "How do I become a partner?",
        answer: "Please contact us via email at trobitscommunity@gmail.com. Your request will be reviewed."
    },
    {
        question: "How do I check data for previous days?",
        answer: "You can check previous burns by visiting the Burns Archives."
    },
    {
        question: "What kinds of Ads are NOT allowed on Trobits?",
        answer: "We are a family-oriented site. We specifically do not allow any ads with adult content. We also do not allow ads promoting illegal products/services such as weapons, prostitution, drugs. We strive to avoid any ads with malware/spyware/viruses. Please if you notice any of these, report it immediately. Remember, we cannot guarantee the ads given they are from a third party."
    },
    {
        question: "Does Trobits endorse any Ads?",
        answer: "NO. We do not endorse any ads shown on our platform."
    },
    {
        question: "Do I need to pay or buy anything in order to participate in burns?",
        answer: "No. You do not need to pay for anything or buy anything in order to participate in the burns. Just by using the platform, we generate revenue through ads. This is what we use to burn the tokens. We do appreciate you spreading the word."
    },
    {
        question: "Is there any fee to use Trobits?",
        answer: "No. There are no fees to use Trobits. We encourage everyone to use the platform. We do appreciate you spreading the word."
    },
    {
        question: "Does Trobits have a mobile application?",
        answer: "We do not currently have a mobile application. This is in development. However, our application is mobile responsive."
    },
    {
        question: "Can I send SHIB/LUNC tokens to Trobits for burns?",
        answer: "Unfortunately, we do not accept tokens from the public. We do not encourage the public to burn their tokens. We encourage you to hold onto your tokens as we hope prices will appreciate through the burns."
    },
    {
        question: "What is the difference between the Total Supply, Maximum Supply, Current Supply and Circulating Supply?",
        answer: "Total Supply: This is the number of tokens that were created. For some projects, not all tokens created have been released into circulation. Maximum Supply: The total number of tokens that will ever exist. For example, Bitcoin has a maximum supply of 21 million tokens. Current Supply: This refers to the portion of the Total Supply that has already been released. Circulating Supply: This refers to the number of tokens that are currently in circulation (Current Supply) minus burnt tokens, staked tokens and tokens in cold wallets."
    },
    {
        question: "How does Trobits work?",
        answer: "Our goal is simple. Reduce the circulating supply of SHIB/LUNC through systematic burning. To achieve this, we generate funds through ads. We use these funds to burn the selected tokens. This is all displayed on the platform for transparency."
    },
    {
        question: "Does Trobits recommend any specific cryptocurrency?",
        answer: "No. We do not recommend any specific cryptocurrency to our visitors. We do not provide any financial advice. Remember, investing in cryptocurrencies is risky and can result in the loss or all or a portion of your investment. Please Do Your Own Research."
    },
    {
        question: "Will the price of SHIB and/or LUNC get to $1?",
        answer: "We cannot guarantee that the price of SHIB and/or LUNC will get to $1. Our goal is to continue burning the tokens and reducing the circulating supply. Hopefully, the price will go up and eventually get to the $1 target."
    }
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
