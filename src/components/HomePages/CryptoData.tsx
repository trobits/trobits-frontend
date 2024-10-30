import TransparentCard from "./CryptoCard/CryptoCard";
import shibaInu from "../../assets/icons/shiba-inu.png";
import Lunc from "../../assets/icons/lunc.png";

export default function CryptoData() {
  // Data for the cards
  const cardData = [
    {
      coin: "SHIB",
      shibPrice: "0.000016939", // Correct price field for SHIB
      luncPrice: "0", // Not used for SHIB, but required by the component structure
      interval: "1 Month",
      icon: shibaInu,
      visits:50,
      revenue:100,
      burns:45
    },
    {
      coin: "LUNC",
      shibPrice: "0", // Not used for LUNC, but required by the component structure
      luncPrice: "0.000090378", // Correct price field for LUNC
      interval: "7 Days",
      icon: Lunc,
      visits:30,
      revenue:170,
      burns:80
    },
    // Add more cards if needed...
  ];

  return (
    <div className="flex justify-center flex-wrap items-center mt-20 space-x-24">
      {cardData.map((card, index) => (
        <TransparentCard key={index} cryptoData={card} index={index} />
      ))}
    </div>
  );
}
