import { ReactNode } from "react";
import Navbar from "../shared/navbar/Navbar";
// import Footer from "../shared/Footer/Footer";
// import CryptoNavbar from "../shared/navbar/CryptoNavbar";
// import Footer from "../shared/Footer/Footer";
const WithCommonLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      {/* <CryptoNavbar /> */}
      {children}

<footer className="bg-gray-100 p-4 text-sm text-center text-gray-700">
  <div className="flex flex-wrap justify-center gap-4">
    <a href="https://coinbase-consumer.sjv.io/GKQLem" target="_blank" rel="noopener noreferrer">💰 Buy Crypto on Coinbase</a>
    <a href="https://printrendy.pxf.io/RGYLLy" target="_blank" rel="noopener noreferrer">🖼️ Print on Demand: PrintRendy</a>
    <a href="https://fanatics.93n6tx.net/dO3DDy" target="_blank" rel="noopener noreferrer">🏈 Sports Gear at Fanatics</a>
    <a href="https://ursime.pxf.io/MAokkN" target="_blank" rel="noopener noreferrer">👗 Shop Fashion at Ursime</a>
    <a href="https://buffalogamescom.sjv.io/K02PPz" target="_blank" rel="noopener noreferrer">🎲 Buffalo Games & Puzzles</a>
  </div>
</footer>

      {/* <Footer /> */}
    </div>
  );
};

export default WithCommonLayout;
