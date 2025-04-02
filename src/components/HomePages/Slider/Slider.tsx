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
import { useState, useEffect } from "react";
import Script from "next/script";

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
declare global {
  interface Window {
    growMe?: ((e: unknown) => void) & unknown[]; // Define growMe globally
  }
}

export function GrowMeWidget() {
  useEffect(() => {
    const loadGrowMeScript = () => {
      if (window.growMe) return; // Avoid multiple script injections

      const growMeArray: unknown[] = [];
      const growMeFunction = (e: unknown) => {
        growMeArray.push(e);
      };

      window.growMe = Object.assign(growMeFunction, growMeArray);

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://faves.grow.me/main.js";
      script.defer = true;
      script.setAttribute("data-grow-faves-site-id", "U2l0ZTplN2U5ODc0NC02MzJjLTQ2NWQtOGI0ZC00YzdlNTZjODAwYzA=");

      document.body.appendChild(script);
    };

    loadGrowMeScript();
  }, []);

  return null; // No UI element needed
}

function AdBannerF() {
  return (
    <>
      <ins className="67c24fd7aa72d3d47fc083ad" style={{ display: "inline-block", width: "1px", height: "1px" }}></ins>

      <Script
        id="ad-banner-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(e,n,c,t,o,r,d){
              !function e(n,c,t,o,r,m,d,s,a){
                s=c.getElementsByTagName(t)[0],
                (a=c.createElement(t)).async=!0,
                a.src="https://"+r[m]+"/js/"+o+".js?v="+d,
                a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},
                s.parentNode.insertBefore(a,s)
              }(window,document,"script","67c24fd7aa72d3d47fc083ad",["cdn.bmcdn6.com"], 0, new Date().getTime())
            }();
          `,
        }}
      />
    </>
  );
}

const Slider = () => {
  const [ currentSlide, setCurrentSlide ] = useState(0);
  const [ timeLeft, setTimeLeft ] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div className="flex justify-center items-center mt-10 sm:mt-20 border-2 border-opacity-80 border-cyan-400 p-4 bg-blue-800 bg-opacity-60 w-full max-w-[900px] mx-auto min-h-40 rounded-lg">
        <div className="text-4xl text-center text-yellow-400 font-bold">
          <AdBannerF />
        </div>
      </div>
    );
  }

  return (
    <div>
<GrowMeWidget />
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
    </div>
  );
};

export default Slider;
