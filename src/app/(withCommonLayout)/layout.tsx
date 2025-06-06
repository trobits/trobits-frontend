
import { ReactNode } from "react";
import Navbar from "../shared/navbar/Navbar";

const WithCommonLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-100 p-4 text-sm text-center text-gray-700">
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://coinbase-consumer.sjv.io/GKQLem" target="_blank" rel="noopener noreferrer">💰 Buy Crypto on Coinbase</a>
          <a href="https://printrendy.pxf.io/RGYLLy" target="_blank" rel="noopener noreferrer">🖼️ Print on Demand: PrintRendy</a>
          <a href="https://fanatics.93n6tx.net/dO3DDy" target="_blank" rel="noopener noreferrer">🏈 Sports Gear at Fanatics</a>
          <a href="https://ursime.pxf.io/MAokkN" target="_blank" rel="noopener noreferrer">👗 Shop Fashion at Ursime</a>
          <a href="https://buffalogamescom.sjv.io/K02PPz" target="_blank" rel="noopener noreferrer">🎲 Buffalo Games & Puzzles</a>
        </div>
      </footer>
    </div>
  );
};

export default WithCommonLayout;
