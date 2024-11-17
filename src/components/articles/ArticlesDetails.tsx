/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useGetSingleArticleQuery } from "@/redux/features/api/articleApi";
import Image from "next/image";
import Link from "next/link";
import Loading from "../Shared/Loading";
import DummyImage from "@/assets/dummy-blog.png";
import { Article } from "@/app/(withCommonLayout)/articles/page";

function ArticleDetailsPage({ articleId }: { articleId: string }) {
    const { data: articleData, isLoading: articleLoading } = useGetSingleArticleQuery(articleId);

    if (articleLoading) {
        return <Loading />;
    }

    const article: Article = articleData?.data;


    // const article = {
    //     image: "/placeholder.svg?height=400&width=800",
    //     title: "The Rise of Quantum Computing: A New Era in Technology",
    //     content: `
    //   <p>Quantum computing, once a concept confined to the realms of theoretical physics, is now emerging as a groundbreaking technology with the potential to revolutionize numerous fields. This article explores the current state of quantum computing and its implications for the future.</p>

    //   <h2>What is Quantum Computing?</h2>
    //   <p>At its core, quantum computing harnesses the principles of quantum mechanics to process information. Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or qubits. These qubits can exist in multiple states simultaneously, a phenomenon known as superposition.</p>

    //   <h2>Advantages of Quantum Computing</h2>
    //   <ul>
    //     <li><strong>Exponential Processing Power:</strong> Quantum computers can perform certain calculations exponentially faster than classical computers.</li>
    //     <li><strong>Complex Problem Solving:</strong> They excel at solving complex problems in optimization, cryptography, and molecular simulation.</li>
    //     <li><strong>Advancements in AI:</strong> Quantum computing could significantly enhance machine learning algorithms and AI capabilities.</li>
    //   </ul>

    //   <h2>Challenges and Limitations</h2>
    //   <p>Despite its potential, quantum computing faces several challenges:</p>
    //   <ol>
    //     <li>Maintaining quantum coherence</li>
    //     <li>Scaling up to more qubits</li>
    //     <li>Error correction in quantum systems</li>
    //   </ol>

    //   <h2>The Future of Quantum Computing</h2>
    //   <p>As research progresses, we can expect to see quantum computers tackling real-world problems in fields such as:</p>
    //   <ul>
    //     <li>Drug discovery and development</li>
    //     <li>Financial modeling and risk assessment</li>
    //     <li>Climate change prediction and mitigation</li>
    //     <li>Cryptography and cybersecurity</li>
    //   </ul>

    //   <p>While we're still in the early stages of this quantum revolution, the potential impact on technology and society is immense. As we continue to overcome the challenges, we move closer to a future where quantum computing becomes an integral part of our technological landscape.</p>
    // `
    // }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <article className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="w-full flex justify-center bg-gray-200">
                    <div className="relative w-full h-[20rem] md:h-[38rem] max-h-[38rem]">
                        {
                            article.image ?
                                <Image
                                    src={article.image}
                                    alt="Quantum computing illustration"
                                    className="rounded-md h-full w-full"
                                    layout="fill"
                                    objectFit="cover"
                                    priority
                                />
                                :
                                <Image
                                    src={DummyImage}
                                    alt="Quantum computing illustration"
                                    layout="fill"
                                    objectFit="cover"
                                    priority
                                />
                        }
                    </div>
                </div>
                <div className="p-6 sm:p-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                        {article.title}
                    </h1>
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>
            </article>
        </div>
    );
}

export default ArticleDetailsPage;
