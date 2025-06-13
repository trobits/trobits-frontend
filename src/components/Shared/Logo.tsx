// import Image from "next/image"
// import Link from "next/link"

// import LogoImage from "@/assets/logo.png";


// const Logo = () => {
//     return (
//         <Link href="/" className="flex justify-center items-center full">
//             <Image src={LogoImage}
//                 className=' p rounded-full'
//                 alt='logo' height={300} width={300} />
//             <div className='flex flex-col justify-center items-center'>
//                 <span className="text-white text-5xl">Trobits</span>
//                 <span className="text-white text-md tracking-widest">EARN 2 BURN</span>
//             </div>
//         </Link>
//     )

// }

// export default Logo


import Image from "next/image";
import Link from "next/link";

import LogoImage from "@/assets/logo.png";

const Logo: React.FC = () => {
    return (
        <Link href="/" className="flex justify-center items-center w-full overflow-hidden">
            <div className="relative flex-shrink-0 h-full overflow-hidden "> {/* Logo takes 1/3 of the parent */}
                <Image
                    src={LogoImage}
                    className="rounded-full w-16"
                    alt="logo"
                    // layout="fill" // Fill the parent div
                    objectFit="contain" // Maintain aspect ratio
                />
            </div>
            <div className="flex flex-col justify-center items-center  w-2/3 h-full"> {/* Text takes 2/3 of the parent */}
                <span className="text-white text-4xl tracking-wider font-inter font-semibold">Trobits</span>
                <span className="text-white text-sm tracking-widest">EARN 2 BURN</span>
            </div>
        </Link>
    );
};

export default Logo;
