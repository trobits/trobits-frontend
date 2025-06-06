/* eslint-disable @typescript-eslint/no-unused-vars */
// components/Footer.js
"use client"
import { FaFacebookF, FaTwitter, FaReddit, FaYoutube, FaTiktok, FaLinkedin, FaInstagram, FaTelegram } from "react-icons/fa";
import Logo from "@/components/Shared/Logo";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef } from "react";


const AdBannerFooter = ({ adClass }: { adClass: string }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  const injectAdScript = () => {
    if (!adContainerRef.current) return;

    // Remove existing ad script if any
    const existingScript = document.querySelector(`script[data-ad-class="${adClass}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    // Create and inject new ad script
    const script = document.createElement("script");
    script.innerHTML = `
      !function(e,n,c,t,o,r,d){
        !function e(n,c,t,o,r,m,d,s,a){
          s=c.getElementsByTagName(t)[0],
          (a=c.createElement(t)).async=!0,
          a.src="https://"+r[m]+"/js/"+o+".js?v="+d,
          a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},
          s.parentNode.insertBefore(a,s)
        }(window,document,"script","${adClass}",["cdn.bmcdn6.com"], 0, new Date().getTime())
      }();
    `;
    script.setAttribute("data-ad-class", adClass);
    document.body.appendChild(script);
  };

  useEffect(() => {
    injectAdScript(); // Inject on mount

    // Listen for page visibility changes (when navigating back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        injectAdScript(); // Re-inject ads on page activation
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [ adClass ]);

  return (
    <div ref={adContainerRef}>
      <ins
        className={adClass}
        style={{ display: "inline-block", width: "1px", height: "1px" }}
        key={adClass + Date.now()}
      ></ins>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black py-8 mt-40 pb-32 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Affiliate Links Section */}
        <div className="bg-gradient-to-r from-cyan-900 via-gray-800 to-cyan-900 rounded-xl p-8 mb-12 shadow-2xl border border-cyan-500/20">
          <h3 className="text-2xl font-bold text-center mb-4 text-cyan-300 tracking-wide flex items-center justify-center gap-2">
            <span className="text-3xl">🎁</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Get Rewards Just for Shopping
            </span>
          </h3>
          <p className="text-sm text-gray-200 text-center mb-8 max-w-2xl mx-auto">
            You buy. You benefit. We all win. We've partnered with top brands to bring you exclusive deals and cash-back opportunities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a 
              href="https://coinbase-consumer.sjv.io/GKQLem" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 border border-cyan-500/10 hover:border-cyan-500/30"
            >
              <span className="text-3xl group-hover:animate-bounce">💰</span>
              <span className="text-gray-200 group-hover:text-cyan-300 font-medium">Buy Crypto on Coinbase</span>
            </a>
            <a 
              href="https://printrendy.pxf.io/RGYLLy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 border border-cyan-500/10 hover:border-cyan-500/30"
            >
              <span className="text-3xl group-hover:animate-bounce">🖼️</span>
              <span className="text-gray-200 group-hover:text-cyan-300 font-medium">Print on Demand: PrintRendy</span>
            </a>
            <a 
              href="https://fanatics.93n6tx.net/dO3DDy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 border border-cyan-500/10 hover:border-cyan-500/30"
            >
              <span className="text-3xl group-hover:animate-bounce">🏈</span>
              <span className="text-gray-200 group-hover:text-cyan-300 font-medium">Sports Gear at Fanatics</span>
            </a>
            <a 
              href="https://ursime.pxf.io/MAokkN" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 border border-cyan-500/10 hover:border-cyan-500/30"
            >
              <span className="text-3xl group-hover:animate-bounce">👗</span>
              <span className="text-gray-200 group-hover:text-cyan-300 font-medium">Shop Fashion at Ursime</span>
            </a>
            <a 
              href="https://buffalogamescom.sjv.io/K02PPz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 border border-cyan-500/10 hover:border-cyan-500/30"
            >
              <span className="text-3xl group-hover:animate-bounce">🎲</span>
              <span className="text-gray-200 group-hover:text-cyan-300 font-medium">Buffalo Games & Puzzles</span>
            </a>
          </div>
        </div>
        <AdBannerFooter adClass="67b00549e904d5920e68f979" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo Section */}
          <div className="flex items-center">
            <Logo />
          </div>


          {/* Company Section */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Company</h2>
            <ul className="space-y-1 text-sm flex flex-col">
              <Link href="/aboutus">About Us</Link>
              <Link href={"/privacypolicy"}>Privacy Policy</Link>
              <Link href={"/cookiepolicy"}>Cookies</Link>
              <Link href={"/disclaimer"}>Disclaimer</Link>
            </ul>
          </div>

          {/* Support Section */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Support</h2>
            <ul className="space-y-1 text-sm flex flex-col">
              <Link href={"/contactUs"}>Contact Us</Link>
              <Link href={"/faq"} className=" mb-2">FAQ</Link>
            </ul>
          </div>

          {/* Social Section */}
          <div className="flex flex-col ">
            <h2 className="text-lg font-semibold mb-2 text-center">Socials</h2>
            <div className="grid grid-cols-3 space-y-2 justify-items-center">
              <Link
                target="_blank"
                href="https://www.facebook.com/profile.php?id=61564695827270"
                aria-label="Facebook"
                className="text-white hover:text-blue-500"
              >
                <FaFacebookF size={20} />
              </Link>
              <Link
                target="_blank"
                href="https://x.com/Trobits_inc"
                aria-label="Twitter"
                className="text-white hover:text-blue-400"
              >
                <FaTwitter size={20} />
              </Link>
              <Link
                target="_blank"
                href="https://www.reddit.com/user/trobits"
                aria-label="Reddit"
                className="text-white hover:text-red-500"
              >
                <FaReddit size={20} />
              </Link>

              <Link
                target="_blank"
                href="https://www.youtube.com/@TrobitsCommunity"
                aria-label="Youtube"
                className="text-white hover:text-blue-500"
              >
                <FaYoutube size={20} />
              </Link>

              <Link
                target="_blank"
                href="https://www.tiktok.com/@trobits_community"
                aria-label="Tiktok"
                className="text-white hover:text-blue-500"
              >
                <FaTiktok size={20} />
              </Link>
              <Link
                target="_blank"
                href="https://linkedin.com/company/trobits"
                aria-label="LinkedIn"
                className="text-white hover:text-blue-500"
              >
                <FaLinkedin size={20} />
              </Link>
              <Link
                target="_blank"
                href="https://t.me/Trobits1"
                aria-label="Telegram"
                className="text-white hover:text-blue-500"
              >
                <FaTelegram size={20} />
              </Link>
              <Link
                target="_blank"
                href="https://www.instagram.com/trobits_inc/"
                aria-label="Instragram"
                className="text-white hover:text-blue-500"
              >
                <FaInstagram size={20} />
              </Link>

            </div>
          </div>

          {/* Faq */}
          {/* Company Section */}

        </div>
      </div>
    </footer>
  );
};


export default Footer;


