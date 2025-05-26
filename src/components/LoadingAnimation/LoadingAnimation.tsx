import * as React from "react";
import Image from "next/image"; // Import Image from next/image
import animationimage from '../../assets/giphy.gif';
export const LoadingAnimation = () => {
  return (
    <div>
      <Image
        src={animationimage}
        alt="Loading animation"
        width={200} // Specify the width you want
        height={200} // Specify the height you want
      />
    </div>
  );
};
