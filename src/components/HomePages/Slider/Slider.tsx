// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from "react";


// const Slider = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);



//   return (
//     <div className="flex flex-col sm:flex-row justify-between items-center mt-10 sm:mt-20 border-2 border-opacity-80 border-cyan-400 p-4 bg-blue-800 bg-opacity-60 w-full max-w-[900px] mx-auto min-h-40 rounded-lg">


     
//     </div>
//   );
// };

// export default Slider;



/* eslint-disable @typescript-eslint/no-unused-vars */
import { AdBannerF } from "@/app/(withCommonLayout)/aboutus/page";
import { useState, useEffect } from "react";

const calculateTimeLeft = () => {
  const targetDate = new Date("2025-01-01T00:00:00").getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference <= 0) {
    return null; // Countdown is over
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds };
};

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div className="flex justify-center items-center mt-10 sm:mt-20 border-2 border-opacity-80 border-cyan-400 p-4 bg-blue-800 bg-opacity-60 w-full max-w-[900px] mx-auto min-h-40 rounded-lg">
        <p className="text-4xl text-center text-yellow-400 font-bold"> <AdBannerF/> </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mt-10 sm:mt-20 border-2 border-opacity-80 border-cyan-400 p-4 bg-blue-800 bg-opacity-60 w-full max-w-[900px] mx-auto min-h-40 rounded-lg">
      <h2 className="text-3xl text- font-bold mb-6 text-yellow-500">BURNING &nbsp; COINS &nbsp;  STARTS &nbsp;  JANUARY  1, 2025:</h2>
      <div className="grid grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center">
          <span className="text-6xl font-bold text-yellow-500">{timeLeft.days}:</span>
          <span className="text-xl text-cyan-300">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-6xl font-bold text-yellow-500">{timeLeft.hours}:</span>
          <span className="text-xl text-cyan-300">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-6xl font-bold text-yellow-500">{timeLeft.minutes}:</span>
          <span className="text-xl text-cyan-300">Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-6xl font-bold text-yellow-500">{timeLeft.seconds}</span>
          <span className="text-xl text-cyan-300">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default Slider;
