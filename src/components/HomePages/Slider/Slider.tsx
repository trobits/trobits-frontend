/* eslint-disable @typescript-eslint/no-unused-vars */
// components/Slider.js
import { useState, useEffect } from "react";

const sliderData = [
  {
    title: "Impact of Burning SHIB and LUNC on Their Value",
  },
  {
    title:
      "SHIB: From Meme to Mainstream – The Evolution of a Crypto Phenomenon",
  },
  {
    title: "LUNC: Terra Classic - From the Ashes to a New Dawn",
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatically change the slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-10 sm:mt-20 border-2 border-opacity-80 border-cyan-400 p-4 bg-blue-800 bg-opacity-60 w-full max-w-[900px] mx-auto min-h-40 rounded-lg">
      {/* Left section */}
      <div className="flex-1 text-center sm:text-left">
        {/* <h3 className="text-white text-sm sm:text-md font-semibold">
          Trobits Articles
        </h3> */}
        {/* <h1 className="text-white text-2xl sm:text-3xl font-bold mt-1 sm:max-w-80">
          Check out our latest trobits articles.
        </h1> */}
      </div>

      {/* Right section */}
      <div className="flex-1 flex flex-col items-center sm:items-end mt-4 sm:mt-0">
        

      </div>
    </div>
  );
};

export default Slider;
