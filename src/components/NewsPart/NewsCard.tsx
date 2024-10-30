// components/Card.tsx
import Image from "next/image";

interface NewsData {
  title: string;
  author: string;
  description: string;
  image: string; //
}

interface NewsCardProps {
  articleData: NewsData;
}

const NewsCard: React.FC<NewsCardProps> = ({ articleData }) => {
  const { title, author, description, image } = articleData;

  return (
    <div className="w-[300px] h-[360px] bg-gray-900 text-white rounded-lg shadow-md overflow-hidden">
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
