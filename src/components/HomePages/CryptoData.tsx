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
          <TransparentCard  cryptoData={card} index={index} />
        </div>
      ))}
    </div>
  );
}





// import React, { useState, useEffect } from "react";
// import TransparentCard from "./CryptoCard/CryptoCard";
// import { StaticImageData } from "next/image";

// interface CryptoData {
//   coin: string;
//   price: string;
//   interval: string;
//   icon: StaticImageData;
//   visits: number;
//   revenue: number;
//   burns: number;
// }

// const ParentComponent: React.FC = () => {
//   const [ cryptoData, setCryptoData ] = useState<CryptoData[]>([]);
//   const [ interval, setInterval ] = useState("daily");

//   const fetchData = async () => {
//     try {
//       const response = await fetch(`/api/crypto-data?interval=${interval}`);
//       const data = await response.json();

//       // Set the data from the API response
//       setCryptoData(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [ interval ]); // Re-fetch data when the interval changes

//   return (
//     <div className="flex gap-4">
//       {cryptoData.map((data, index) => (
//         <TransparentCard key={index} cryptoData={data} index={index} />
//       ))}

//       {/* Interval selection buttons */}
//       <div className="mt-4">
//         <button onClick={() => setInterval("daily")}>Daily</button>
//         <button onClick={() => setInterval("weekly")}>Weekly</button>
//         <button onClick={() => setInterval("monthly")}>Monthly</button>
//       </div>
//     </div>
//   );
// };

// export default ParentComponent;
