"use client"
import { useState, useEffect } from "react";
import Image from "next/image";

interface NewsData {
  title: string;
  author: string;
  description: string;
  image: string;
}

interface NewsCardProps {
  articleData: NewsData;
}

const NewsCard: React.FC<NewsCardProps> = ({ articleData }) => {
  const { title, author, description, image } = articleData;

  // State to manage when the card should appear
  const [isVisible, setIsVisible] = useState(false);

  // Trigger the animation after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Delays the animation slightly
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`w-[300px] h-[360px] bg-gray-900 text-white rounded-lg shadow-md overflow-hidden transform transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div className="relative h-40">
        <Image src={image} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-400">by: {author}</p>
        <p className="mt-2 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default NewsCard;
