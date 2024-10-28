// components/Slider.js
import { useState, useEffect } from 'react';

const sliderData = [
  {
    title: 'Impact of Burning SHIB and LUNC on Their Value',
  },
  {
    title: 'SHIB: From Meme to Mainstream – The Evolution of a Crypto Phenomenon',
  },
  {
    title: 'LUNC: Terra Classic - From the Ashes to a New Dawn',
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
    <div className="flex justify-between items-center mt-40 border-2 border-opacity-80 border-cyan-400 p-4 bg-blue-800 bg-opacity-60 w-[900px] mx-auto min-h-40 rounded-lg">
      {/* Left section */}
      <div className="flex-1">
        <h3 className="text-white text-md font-semibold">Trobits Articles</h3>
        <h1 className="text-white text-3xl font-bold mt-1 max-w-80">
          Check out our latest trobits articles.
        </h1>
      </div>

      {/* Right section */}
      <div className="flex-1 flex flex-col items-end">
        <div className="bg-teal-500 p-3 rounded-md w-64 text-center">
          <h3 className="text-white text-sm font-medium">
            {sliderData[currentSlide].title}
          </h3>
        </div>
        {/* Slide indicators */}
        <div className="mt-4 flex space-x-2">
          {sliderData.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${
                index === currentSlide ? 'bg-teal-500' : 'bg-white'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
