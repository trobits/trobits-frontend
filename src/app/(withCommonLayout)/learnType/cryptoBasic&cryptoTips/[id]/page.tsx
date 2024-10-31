import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { IoBookSharp } from "react-icons/io5";
import Link from "next/link";

interface ParamsType {
  id: string;
}

interface ParamsParams {
  params: ParamsType;
}

const LearnDetailsPage = ({ params }: ParamsParams) => {


  const cryptoTypesAndCryptoBasics = [
    {
      id: 1,
      chapter: "Chapter 1",
      cryptoQuestion: "Understanding Blockchain Technology?",
      title: "Understanding Blockchain Technology",
      description:
        "Blockchain is a decentralized ledger technology that records transactions across multiple computers. This ensures that the data is transparent, secure, and tamper-proof.",
      image:
        "https://www.shutterstock.com/image-vector/cryptocurrency-coins-banner-concept-digital-600nw-2049622757.jpg",
      type: "Chapter-6"
    },
    {
      id: 2,
      chapter: "Chapter 2",
      cryptoQuestion: "Understanding Blockchain Technology?",
      title: "Bitcoin: The Pioneer",
      description:
        "Bitcoin was designed as a decentralized digital currency, allowing users to transact directly with each other without intermediaries. Its fixed supply of 21 million coins creates digital scarcity, driving its value proposition.",
      image:
        "https://www.shutterstock.com/image-vector/cryptocurrency-coins-banner-concept-digital-600nw-2049622757.jpg",
      type: "Chapter-5"
    },
    {
      id: 3,
      chapter: "Chapter 4",
      title: "Exploring Altcoins",
      cryptoQuestion: "Understanding Blockchain Technology?",
      description:
        "Altcoins encompass all cryptocurrencies other than Bitcoin. They offer diverse features and functionalities, addressing specific use cases or technological advancements.",
      image:
        "https://www.shutterstock.com/image-vector/cryptocurrency-coins-banner-concept-digital-600nw-2049622757.jpg",
      type: "Tipes"
    }, {
      "id": 4,
      title: "Understanding Blockchain Technology",
      cryptoQuestion: "Understanding Blockchain Technology?",
      description:
        "Blockchain is a decentralized ledger technology that records transactions across multiple computers. This ensures that the data is transparent, secure, and tamper-proof.",
      image:
        "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
      type: "Basics"
    },
    {
      "id": 5,
      title: "Bitcoin: The Pioneer",
      cryptoQuestion: "Understanding Blockchain Technology?",
      description:
        "Bitcoin was designed as a decentralized digital currency, allowing users to transact directly with each other without intermediaries. Its fixed supply of 21 million coins creates digital scarcity, driving its value proposition.",
      image:
        "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
      type: "Chapter-1"
    },
    {
      "id": 6,
      title: "Exploring Altcoins",
      cryptoQuestion: "Understanding Blockchain Technology?",
      description:
        "Altcoins encompass all cryptocurrencies other than Bitcoin. They offer diverse features and functionalities, addressing specific use cases or technological advancements.",
      image:
        "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
      type: "Chapter-2"
    },
  ]
  const currentItemId = Number(params.id)
  const currentItem = cryptoTypesAndCryptoBasics.find((item) => item.id === currentItemId)
  return (
    <div className="bg-transparent mt-20">
      <h1 className=" font-bold text-white flex items-center gap-2 text-xl ">
        <IoBookSharp className=" text-cyan-500 size-9 ml-6" />
        <Link className="hover:text-cyan-600" href={"/learn"}> Learns</Link> /-<Link href={"/articles"} className="cursor-pointer hover:text-cyan-500 transition-all"> {currentItem?.type}</Link></h1>
      {" "}
      {/* Set background to transparent */}
      <Card className="max-w-4xl mx-auto bg-transparent border-none text-white">
        {" "}
        {/* Ensure Card has no background */}
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl text-center font-bold">
            {currentItem?.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={(currentItem?.image as string)}
              alt="Hand holding a bitcoin against roses"
              className="object-cover hover:scale-105 transition-all duration-300"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
          <div className="prose prose-gray max-w-none">
            <p className="text-white leading-relaxed text-2xl font-semibold">
              {currentItem?.cryptoQuestion}
            </p>
            <p className="text-white leading-relaxed">
              {currentItem?.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnDetailsPage;
