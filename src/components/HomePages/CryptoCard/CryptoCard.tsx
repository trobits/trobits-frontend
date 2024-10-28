import React from "react";
import Image, { StaticImageData } from "next/image";

// Define the CryptoData interface separately
interface CryptoData {
  coin: string;
  shibPrice: string;
  luncPrice: string;
  interval: string;
  icon: StaticImageData;
}

// Now define the TransparentCard interface which accepts cryptoData prop
interface TransparentCardProps {
  cryptoData: CryptoData;
  index: number; // Add index as a prop
}

const TransparentCard: React.FC<TransparentCardProps> = ({ cryptoData, index }) => {
  const { coin, shibPrice, luncPrice, interval, icon } = cryptoData;

  // Conditionally set the display values based on index
  const isShib = index === 0; // Display SHIB if index is 0
  const price = isShib ? shibPrice : luncPrice;
  const coinName = isShib ? 'SHIB' : 'LUNC';

  return (
    <div className="bg-transparent border border-cyan-400 rounded-xl p-8 min-w-[400px] min-h-[300px] text-white shadow-lg backdrop-blur-md">
      <div className="flex gap-4 items-center ">
        <Image
          src={icon} // Use dynamic image path
          alt={`${coin} logo`}
          width={60} // Increased width of the image
          height={60} // Increased height of the image
          className="rounded-full"
        />
        <span className="ml-auto bg-gray-800 px-3 py-2 text rounded-3xl border border-cyan-400 bg-transparent ">
          Interval-{interval}
        </span>
      </div>

      {/* Prices Section */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span>{coinName}:</span>
          <span>{price}</span>
        </div>

        <div className="flex justify-between">
          <span>Visits:</span>
          <span>0</span>
        </div>

        <div className="flex justify-between">
          <span>Revenue:</span>
          <span>0</span>
        </div>

        <div className="flex justify-between">
          <span>Burns:</span>
          <span>0</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
            <div
              style={{ width: "0%" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
            ></div>
          </div>
          <div className="text-center text-xs text-gray-500">
            Daily Projected Burned (0%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransparentCard;
