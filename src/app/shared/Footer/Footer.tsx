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
    <footer className="bg-black py-8  pb-32 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="grid grid-cols-4 mt-2 -mr-4">
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


