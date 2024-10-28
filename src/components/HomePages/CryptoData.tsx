import TransparentCard from "./CryptoCard/CryptoCard";
import shibaInu from '../../assets/icons/shiba-inu.png'
import Lunc from '../../assets/icons/lunc.png'
export default function CryptoData() {
  // Data for the cards
  const cardData = [
    {
      coin: "SHIB",
      price: "0.000016939",
      interval: "1 Month",
      icon:shibaInu
    },
    {
      coin: "LUNC",
      price: "0.000090378",
      interval: "7 Days",
      icon:Lunc
    },
    // Add more cards if needed...
  ];

  return (
    <div className="flex justify-center items-center h-screen  space-x-4">
      {cardData.map((card, index) => (
        <TransparentCard
          key={index}
        cryptoData={card}
        />
      ))}
    </div>
  );
}
