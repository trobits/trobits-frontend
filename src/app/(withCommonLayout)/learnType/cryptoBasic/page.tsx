
import LearnComponent from "@/components/LearnComponent/LearnComponent";
import * as React from "react";
const cryptoBasics = [
  {
    "id":4,
    title: "Understanding Blockchain Technology",
    cryptoQuestion: "Understanding Blockchain Technology?",
    description:
      "Blockchain is a decentralized ledger technology that records transactions across multiple computers. This ensures that the data is transparent, secure, and tamper-proof.",
    image:
      "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
      type:"Basics"
  },
  {
    "id":5,
    title: "Bitcoin: The Pioneer",
    cryptoQuestion: "Understanding Blockchain Technology?",
    description:
      "Bitcoin was designed as a decentralized digital currency, allowing users to transact directly with each other without intermediaries. Its fixed supply of 21 million coins creates digital scarcity, driving its value proposition.",
    image:
      "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
    type: "Chapter-1"
  },
  {
    "id":6,
    title: "Exploring Altcoins",
    cryptoQuestion: "Understanding Blockchain Technology?",
    description:
      "Altcoins encompass all cryptocurrencies other than Bitcoin. They offer diverse features and functionalities, addressing specific use cases or technological advancements.",
    image:
      "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
       type: "Chapter-2"
  },
];
const CryptoTips = () => {
  return (
    <div>
      <LearnComponent title={"Crypto Basics"} cryptoBasic={cryptoBasics} />
    </div>
  );
};
export default CryptoTips;
