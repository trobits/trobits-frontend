// components/Footer.js
import { FaFacebookF, FaTwitter, FaReddit } from "react-icons/fa";
import Logo from "@/components/Shared/Logo";

const Footer = () => {
  return (
    <footer className="bg-black py-8 mt-40 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo Section */}
          <div className="flex items-center">
            <Logo/>
          </div>

          {/* Leaderboard Section */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Leaderboard</h2>
            <ul className="space-y-1 text-sm">
              <li>Most Visited</li>
              <li>Trending</li>
              <li>Recently Added</li>
              <li>Coins</li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Company</h2>
            <ul className="space-y-1 text-sm">
              <li>About Us</li>
              <li>Privacy Policy</li>
              <li>Cookies</li>
              <li>Disclaimer</li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Support</h2>
            <ul className="space-y-1 text-sm">
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Social Section */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Socials</h2>
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-white hover:text-blue-500"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-white hover:text-blue-400"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                aria-label="Reddit"
                className="text-white hover:text-red-500"
              >
                <FaReddit size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
