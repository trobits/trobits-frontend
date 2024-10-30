import TransparentCard from "./CryptoCard/CryptoCard";
import shibaInu from "../../assets/icons/shiba-inu.png";
import Lunc from "../../assets/icons/lunc.png";

export default function CryptoData() {
  // Data for the cards
  const cardData = [
    {
      coin: "SHIB",
      shibPrice: "0.000016939",
      luncPrice: "0",
      interval: "1 Month",
      icon: shibaInu,
      visits: 50,
      revenue: 100,
      burns: 45,
    },
    {
      coin: "LUNC",
      shibPrice: "0",
      luncPrice: "0.000090378",
      interval: "7 Days",
      icon: Lunc,
      visits: 30,
      revenue: 170,
      burns: 80,
    },
  ];

  return (
    <div className="flex justify-center flex-wrap items-center mt-20 gap-24">
      {cardData.map((card, index) => (
        <div
          key={index}
          className={`animated-card ${
            index === 0 ? "slide-left" : "slide-right"
          }`}
        >
          <TransparentCard cryptoData={card} index={index} />
        </div>
      ))}
    </div>
  );
}
