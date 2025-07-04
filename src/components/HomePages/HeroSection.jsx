import heroImage from "../../assets/how-trobits-work.jpeg"
import Image from "next/image";
import { TextGenerateEffect } from "../ui/textGenerateEffect";

export default function HeroSection() {
   
    return (
        <section className="">
            <div className="flex flex-row items-center gap-10">
                <div className="">
                    <Image
                        src={heroImage}
                        height={350}
                        width={400}
                        alt="How Trobits Works"
                        className="max-w-md w-[550px] h-[550px] object-contain rounded-2xl"
                    />            
                </div>
                <div className="text-white flex flex-col justify-between gap-16 py-5">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">Welcome to Trobits</h1>
                        <TextGenerateEffect words="Trobits seeks to boost the value of select cryptocurrencies by permanently burning coins using revenue from affiliates and advertisers, reducing their circulating supply." className="text-white" />
                        {/* <p className="text-lg mb-6 max-w-[600px]">Trobits is a platform that aims to increase the value of selected cryptocurrencies by reducing their circulating supply through permanent coin burns, funded by revenue from affiliates and advertisers.</p> */}
                    </div>
                    <div>
                        <div className="aspect-w-16 aspect-h-9">
                            <video src="/demoVideo.mp4" controls autoPlay playsInline muted className="max-w-[600px] h-auto" />
                        </div>
                </div>
                </div>
            </div>
        </section>
    );
}