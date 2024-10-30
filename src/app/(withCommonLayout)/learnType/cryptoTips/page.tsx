
import LearnComponent from "@/components/LearnComponent/LearnComponent";
import * as React from "react";
const cryptoTips = [
  {
    id: 1,
    chapter: "Chapter 1",
    cryptoQuestion: "Understanding Blockchain Technology?",
    title: "Understanding Blockchain Technology",
    description:
      "Blockchain is a decentralized ledger technology that records transactions across multiple computers. This ensures that the data is transparent, secure, and tamper-proof.",
    image:
      "https://www.shutterstock.com/image-vector/cryptocurrency-coins-banner-concept-digital-600nw-2049622757.jpg",
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
  },
];
const CryptoTips = () => {
  return (
    <div>
      <LearnComponent title={"Tips & Tutorial"} cryptoBasic={cryptoTips} />
    </div>
  );
};
export default CryptoTips;
