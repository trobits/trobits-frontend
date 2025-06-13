"use client";
import { Flame, TrendingUp, Wallet, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import imagesCoin from "../../../assets/how-trobits-work.png";
import Footer from "@/app/shared/Footer/Footer";
import { setPaths } from "@/redux/features/slices/authSlice";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const features = [
  {
    icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
    title: "VISITS",
    description:
      "Hangout with thousands for the ultimate crypto experience! Stay informed with real-time news, learn from experts, play games and share ideas and opinions with friends and community members.",
    color: "blue",
  },
  {
    icon: <Wallet className="w-8 h-8 text-green-400" />,
    title: "REVENUE",
    description:
      "Every interaction contributes to revenue generation, which is used to burn your favorite coins, increasing their value. Join the millions in shaping the future value of your coin.",
    color: "green",
  },
  {
    icon: <Flame className="w-8 h-8 text-orange-400" />,
    title: "BURNS",
    description:
      "Engagement on the platform generates revenue which is used to burn your favorite coins, reducing their supply and potentially increasing their market value.",
    color: "orange",
  },
];

function HowItWorks() {
  const pathName = usePathname();
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const dispatch = useAppDispatch();
  
  if (typeof window !== "undefined") {
    if (previousPath !== "/howitworks" && currentPath === "/howitworks") {
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="container mx-auto px-6 py-16">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Our Features
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            How It Works
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Discover how our platform transforms engagement into value through innovative burn mechanisms
          </p>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent w-64" />
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center mb-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/5 rounded-3xl blur-3xl group-hover:bg-white/10 transition-all duration-500"></div>
            <div className="relative bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl p-8 hover:border-gray-700/70 transition-all duration-500">
              <Image
                src={imagesCoin}
                height={500}
                width={500}
                alt="How Trobits Works"
                className="w-full max-w-lg h-auto object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const colorClasses = {
              blue: "bg-blue-600/20 border-blue-500/30",
              green: "bg-green-600/20 border-green-500/30", 
              orange: "bg-orange-600/20 border-orange-500/30"
            };

            return (
              <div
                key={index}
                className="group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                <Card className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl overflow-hidden hover:bg-gray-900/80 hover:border-gray-700/80 transition-all duration-500 h-full">
                  <CardContent className="p-8 h-full flex flex-col">
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white text-center mb-4 group-hover:text-gray-100 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-400 text-center leading-relaxed flex-1 group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                    
                    {/* Bottom accent */}
                    <div className="mt-6 pt-4 border-t border-gray-800/50">
                      <div className="flex justify-center">
                        <div className={`w-12 h-1 rounded-full ${
                          feature.color === 'blue' ? 'bg-blue-400' :
                          feature.color === 'green' ? 'bg-green-400' : 'bg-orange-400'
                        } opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Process Flow */}
        <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">The Process</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center mb-3">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Engage</h4>
              <p className="text-gray-400 text-sm">Users visit and interact with our platform</p>
            </div>
            
            <div className="hidden md:block w-8 h-px bg-gray-700"></div>
            
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-12 h-12 bg-green-600/20 border border-green-500/30 rounded-xl flex items-center justify-center mb-3">
                <span className="text-green-400 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Generate</h4>
              <p className="text-gray-400 text-sm">Interactions create revenue for the platform</p>
            </div>
            
            <div className="hidden md:block w-8 h-px bg-gray-700"></div>
            
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-12 h-12 bg-orange-600/20 border border-orange-500/30 rounded-xl flex items-center justify-center mb-3">
                <span className="text-orange-400 font-bold">3</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Burn</h4>
              <p className="text-gray-400 text-sm">Revenue is used to burn tokens, increasing value</p>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default HowItWorks;