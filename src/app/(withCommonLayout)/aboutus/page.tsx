"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/app/shared/Footer/Footer"
import Script from "next/script";
import { setPaths } from "@/redux/features/slices/authSlice";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Users, Newspaper, Gamepad2, MessageCircle, Target, Heart, Award, Flame } from "lucide-react";

export default function AboutUs() {
  const dispatch = useAppDispatch();
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const pathName = usePathname();

  if (typeof window !== "undefined") {
    if (previousPath !== "/aboutus" && currentPath === "/aboutus") {
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }

  const offerings = [
    {
      icon: <Newspaper className="w-6 h-6 text-blue-400" />,
      title: "Up-to-Date Crypto News",
      description: "Stay informed with the latest in cryptocurrency, from breaking news to in-depth analyses of currencies, projects, and trends."
    },
    {
      icon: <Award className="w-6 h-6 text-green-400" />,
      title: "Engaging Articles",
      description: "Dive into a range of articles that break down complex crypto topics in a clear, reader-friendly manner."
    },
    {
      icon: <Gamepad2 className="w-6 h-6 text-purple-400" />,
      title: "Playful Games",
      description: "Test your crypto knowledge with our interactive games—a fun way to learn and stay sharp."
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-orange-400" />,
      title: "Vibrant Social Community",
      description: "Connect with fellow crypto enthusiasts, discuss the latest, share ideas, or just enjoy some friendly banter."
    }
  ];

  const teamMembers = [
    {
      name: "Tabi",
      bio: "Tabi transitioned from crypto skepticism to enthusiasm in 2021. He initially ventured into bot trading and quickly delved into blockchain technology. Although he faced setbacks during the 2022 crash, his passion for LUNC and the potential of crypto remains steadfast."
    },
    {
      name: "Rolin",
      bio: "A long-time crypto advocate, Rolin has been instrumental in developing strategies for Trobits. He shares Tabi's dedication to LUNC and continues to work on creative ways to boost the crypto community's resilience."
    },
    {
      name: "Calvin",
      bio: "With a background in Information Technology, Calvin brings over 20 years of experience to Trobits. An investor in Shiba Inu and Cardano, he is passionate about crypto's future and dedicated to providing a secure, engaging platform."
    },
    {
      name: "Arrey",
      bio: "The growth of the cryptocurrency market is evident. It is never too late to take action. Arrey believes in the use of digital media to change the narrative around cryptocurrency and power the value of coins that have stood the test of time."
    },
    {
      name: "Bernard",
      bio: "With the relentless growth and acceptance of cryptocurrency, Bernard believes there is a need for crypto social communities. He is passionate about bridging technology and social connectivity, contributing to the development of an inclusive space."
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white mt-16">
      <div className="container mx-auto px-6 py-16">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Our Story
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            About Us
          </h1>
          
          <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Trobits: Your Fun Zone for Crypto News and Community
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              Welcome to Trobits! We're a passionate group dedicated to making
              cryptocurrency and blockchain technology accessible and engaging for everyone.
              Whether you're a seasoned crypto enthusiast or just starting out, Trobits
              is your go-to hub for news, information, and entertainment.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What We Offer</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover the comprehensive suite of features designed to enhance your crypto journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerings.map((item, index) => (
              <div
                key={index}
                className="group bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-900/80 hover:border-gray-700/80 transition-all duration-500 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black/30 border border-gray-800/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gray-100 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Mission */}
        <div className="mb-16">
          <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl p-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Flame className="w-6 h-6 text-orange-400" />
                <h2 className="text-3xl font-bold text-white">Making a Difference</h2>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-gray-400 leading-relaxed text-lg text-center">
                At Trobits, we believe in crypto's potential. That's why we use ad revenue to burn
                LUNC and SHIB tokens, promoting a more sustainable crypto ecosystem. Track the
                impact directly on our homepage with live data on visitor counts, ad revenue, and
                the amount of LUNC and SHIB burned!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4 bg-black/30 border border-gray-800/30 rounded-2xl">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">Transparency</h4>
                  <p className="text-gray-400 text-sm">Full visibility into our burning efforts</p>
                </div>
                <div className="text-center p-4 bg-black/30 border border-gray-800/30 rounded-2xl">
                  <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">Community</h4>
                  <p className="text-gray-400 text-sm">Building together for a better future</p>
                </div>
                <div className="text-center p-4 bg-black/30 border border-gray-800/30 rounded-2xl">
                  <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">Impact</h4>
                  <p className="text-gray-400 text-sm">Real results through token burns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Why Choose Trobits?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                "We make crypto fun and approachable",
                "Our community is welcoming to enthusiasts of all experience levels",
                "We're committed to transparency in our burning efforts",
                "We continually add new features to keep things exciting"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-black/30 border border-gray-800/30 rounded-2xl">
                  <div className="w-6 h-6 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <p className="text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Join */}
        <div className="mb-16">
          <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Join the Revolution?
              </h3>
              <p className="text-xl text-gray-300 mb-6">
                Join the Trobits community today and explore the world of crypto like never before!
              </p>
              <div className="flex justify-center">
                <div className="px-6 py-3 bg-white text-black rounded-2xl font-semibold">
                  Get Started Today
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meet the Team */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Meet the Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get to know the passionate individuals driving Trobits forward
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-900/80 hover:border-gray-700/80 transition-all duration-500 hover:scale-105"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                    <span className="text-white font-bold text-lg">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-gray-100 transition-colors duration-300">
                    {member.name}
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}