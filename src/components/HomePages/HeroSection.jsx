import heroImage from "../../assets/how-trobits-work.jpeg"
import Image from "next/image";
import { TextGenerateEffect } from "../ui/textGenerateEffect";

export default function HeroSection() {

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-10">
                {/* Image Section */}
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-start order-2 lg:order-1">
                    <Image
                        src={heroImage}
                        height={350}
                        width={400}
                        alt="How Trobits Works"
                        className="w-full max-w-sm sm:max-w-md lg:w-[550px] h-[550px] object-contain rounded-2xl shadow-lg"
                        priority
                    />
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 text-white flex flex-col justify-between gap-8 sm:gap-12 lg:gap-16 py-5 order-1 lg:order-2">
                    {/* Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
                            Welcome to Trobits
                        </h1>
                        <div className="text-sm sm:text-base lg:text-lg">
                            <TextGenerateEffect
                                words="Trobits seeks to boost the value of select cryptocurrencies by permanently burning coins using revenue from affiliates and advertisers, reducing their circulating supply."
                                className="text-white leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Video Section */}
                    <div className="w-full">
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
                            <video
                                src="/demoVideo.mp4"
                                controls
                                autoPlay
                                playsInline
                                muted
                                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}