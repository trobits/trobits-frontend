"use client";
import { Flame, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import imagesCoin from "../../../assets/how-trobits-work.png";
import Footer from "@/app/shared/Footer/Footer";
import { setPaths } from "@/redux/features/slices/authSlice";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
const features = [
  {
    icon: <TrendingUp className="w-12 h-12 text-white" />,
    title: "VISITS",
    description:
      "Hangout with thousands for the ultimate crypto experience! Stay informed with real-time news, learn from experts, play games and share ideas and opinions with friends and community members.",
  },
  {
    icon: <Wallet className="w-12 h-12 text-white" />,
    title: "REVENUE",
    description:
      "Every interaction contributes to revenue generation, which is used to burn your favorite coins, increasing their value. Join the millions in shaping the future value of your coin.",
  },
  {
    icon: <Flame className="w-12 h-12 text-white" />,
    title: "BURNS",
    description:
      "Engagement on the platform generates revenue which is used to burn your favorite coins, reducing their supply and potentially increasing their market value.",
  },
];
function HowItWorks() {

  const pathName = usePathname();
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const dispatch = useAppDispatch();
    if (window) {
      if (previousPath !== "/howitworks" && currentPath === "/howitworks") {
        dispatch(setPaths(pathName));
        window.location.reload();
      }
    }
    
  return (
    <div className=" pt-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-2">
          <h2 className="text-cyan-400 mb-2">Our Features</h2>
          <h1 className="text-4xl font-bold text-white mb-2">How It Works</h1>
          <div className="w-[35rem] h-[35rem] mx-auto mb-8 rounded">
            <Image
              src={imagesCoin}
              height={600}
              width={600}
              alt="Crypto mascot"
              className="w-[60rem] h-[60rem] object-contain rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 mt-80 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-slate-900/50 border-cyan-400 border backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white text-center mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-center text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default HowItWorks;
