import React from "react";
import smgImg from "@/assets/smg.png";
import tiktok from "@/assets/tiktok.jpg";
import coinbase from  "@/assets/coinbase.png";
// Testerup
export const TesterupCard = ({ compact = false }: { compact?: boolean }) => (
  <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
    <div className="flex flex-col items-center gap-1 h-full justify-between">
      <a
        rel="noopener sponsored"
        href="https://aestimiumgmbh.pxf.io/c/6232366/2934755/32340"
        target="_blank"
        id="2934755"
        className="block w-full relative flex justify-center items-center" // ✅ center the image
        style={{ minHeight: compact ? "200px" : "300px" }} // ✅ give height for vertical space
      >
        <img
          src="//a.impactradius-go.com/display-ad/32340-2934755"
          alt="Testerup"
          width="1200"
          height="627"
          className={`rounded-lg w-full ${compact ? "max-h-full object-contain" : "h-full max-h-[300px] object-contain"}`}
        />
      </a>

      <img
        height="0"
        width="0"
        src="https://imp.pxf.io/i/6232366/2934755/32340"
        style={{ position: "absolute", visibility: "hidden" }}
        alt=""
      />

      <div className="text-center w-full px-2">
        <h3 className="text-xs font-semibold text-cyan-300">
          Signup and Earn 750 points
        </h3>
      </div>
    </div>
  </div>
);



// TikTok
export const TikTokCard = ({ compact = false }: { compact?: boolean }) => (
  <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
    <div className="flex flex-col items-center gap-1 h-full justify-between">
      <a
        rel="noopener sponsored"
        href="https://tiktok.pxf.io/c/6232366/2220947/27618"
        target="_blank"
        id="2220947"
        className="block w-full relative max-h-[85%]"
      >
        <img
          src={tiktok.src}
         
          alt="TikTok"
          width="5418"
          height="5417"
          className={`rounded-lg w-full ${compact ? "max-h-full object-contain" : 'h-full max-h-[300px] object-contain'}`}
        />
      </a>
      <img height="0" width="0" src="https://imp.pxf.io/i/6232366/2220947/27618" style={{ position: "absolute", visibility: "hidden" }} alt="" />
      <div className="text-center w-full px-2">
        <h3 className="text-xs font-semibold text-cyan-300">Signup and earn 2,000 points</h3>
      </div>
    </div>
  </div>
);

// Social Catfish
export const SocialCatfishCard = ({ compact = false }: { compact?: boolean }) => (
  <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
    <div className="flex flex-col items-center gap-1 h-full justify-between">
      <a
        rel="noopener sponsored"
        href="https://social-catfish.pxf.io/c/6232366/1790174/12693"
        target="_blank"
        id="1790174"
        className="block w-full relative flex justify-center items-center" // ✅ added flex centering
        style={{ minHeight: compact ? "200px" : "300px" }} // ✅ ensures height to allow vertical centering
      >
        <img
          src="//a.impactradius-go.com/display-ad/12693-1790174"
          alt="Social Catfish"
          width="320"
          height="50"
          className={`rounded-lg w-full ${compact ? "max-h-full object-contain" : "h-full max-h-[300px] object-contain"}`}
        />
      </a>

      <img
        height="0"
        width="0"
        src="https://imp.pxf.io/i/6232366/1790174/12693"
        style={{ position: "absolute", visibility: "hidden" }}
        alt=""
      />

      <div className="text-center w-full px-2">
        <h3 className="text-xs font-semibold text-cyan-300">
          Signup and Earn 3,000 points
        </h3>
      </div>
    </div>
  </div>
);


// NEXO
export const NexoCard = ({ compact = false }: { compact?: boolean }) => (
  <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
    <div className="flex flex-col items-center gap-1 h-full justify-between">
      <a
        rel="noopener sponsored"
        href="https://nexo.sjv.io/c/6232366/2218907/12544"
        target="_blank"
        id="2218907"
        className="block w-full relative max-h-[85%]"
      >
        <img
          src="//a.impactradius-go.com/display-ad/12544-2218907"
         
          alt="NEXO"
          width="1080"
          height="1080"
          className={`rounded-lg w-full ${compact ? "max-h-full object-contain" : 'h-full max-h-[300px] object-contain'}`}
        />
      </a>
      <img height="0" width="0" src="https://imp.pxf.io/i/6232366/2218907/12544" style={{ position: "absolute", visibility: "hidden" }} alt="" />
      <div className="text-center w-full px-2">
        <h3 className="text-xs font-semibold text-cyan-300">Signup and earn 250 points after your first transaction</h3>
      </div>
    </div>
  </div>
);

// NordVPN
export const NordVPNCard = ({ compact = false }: { compact?: boolean }) => (
  <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
    <div className="flex flex-col items-center gap-1 h-full justify-between">
      <a
        rel="noopener sponsored"
        href="https://nordvpn.sjv.io/c/6232366/512103/7452"
        target="_blank"
        id="512103"
        className="block w-full relative max-h-[85%]"
      >
        <img
          src="//a.impactradius-go.com/display-ad/7452-512103"
        
          alt="NordVPN"
          width="300"
          height="250"
          className={`rounded-lg w-full ${compact ? "max-h-full object-contain" : 'h-full max-h-[300px] object-contain'}`}
        />
      </a>
      <img height="0" width="0" src="https://nordvpn.sjv.io/i/6232366/512103/7452" style={{ position: "absolute", visibility: "hidden" }} alt="" />
      <div className="text-center w-full px-2">
        <h3 className="text-xs font-semibold text-cyan-300">Purchase any plan and earn 20,000 points</h3>
      </div>
    </div>
  </div>
);

// Coinbase
export const CoinbaseCard = ({ compact = false }: { compact?: boolean }) => (
  <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
    <div className="flex flex-col items-center gap-1 h-full justify-between">
      <a
        rel="noopener sponsored"
        href="https://coinbase-consumer.sjv.io/c/6232366/1039486/9251"
        target="_blank"
        id="1039486"
        className="block w-full relative max-h-[85%]"
      >
        <img
          src={coinbase.src}
          
          alt="Coinbase"
          width="2081"
          height="367"
          className={`rounded-lg w-full ${compact ? "max-h-full object-contain" : 'h-full max-h-[300px] object-contain'}`}
        />
      </a>
      <img height="0" width="0" src="https://imp.pxf.io/i/6232366/1039486/9251" style={{ position: "absolute", visibility: "hidden" }} alt="" />
      <div className="text-center w-full px-2">
        <h3 className="text-xs font-semibold text-cyan-300">Signup and earn 2,500 points after your first trade</h3>
      </div>
    </div>
  </div>
);

// Gemini
export const GeminiCard = ({ compact = false }: { compact?: boolean }) => (
  <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
    <div className="flex flex-col items-center gap-1 h-full justify-between">
      <a
        rel="sponsored"
        href="https://gemini.sjv.io/c/6232366/2794807/11829"
        target="_blank"
        className="block w-full relative"
      >
        <img
          src="https://a.impactradius-go.com/display-ad/11829-2794807"
          alt="Gemini Exchange"
          width="1422"
          height="800"
          className={`rounded-lg w-full ${compact ? "h-20 object-cover" : 'h-full max-h-[300px] object-contain'}`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
      </a>
      <img
        height="0"
        width="0"
        src="https://imp.pxf.io/i/6232366/2794807/11829"
        style={{ position: "absolute", visibility: "hidden" }}
        alt=""
      />
      <div className="text-center w-full px-2">
        <h3 className="text-xs py-1 font-semibold text-cyan-300">Signup and earn 5,000 points after your first transaction</h3>
      </div>
    </div>
  </div>
);

// Stock Market Guides
export const StockMarketGuidesCard = ({ compact = false }: { compact?: boolean }) => (
  <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
    <div className="flex flex-col items-center gap-1 h-full justify-between">
      <a
        rel="sponsored"
        href="https://stockmarketguides.sjv.io/c/6232366/1863442/20465"
        target="_blank"
        className="block w-full relative flex-1 max-h-[85%]"
      >
       <img
            src={smgImg.src}
            alt="Stock Market Guides"
            className={`rounded-lg w-full object-contain h-full max-h-[300px]`}
          />

      </a>
      <img
        height="0"
        width="0"
        src="https://imp.pxf.io/i/6232366/1863442/20465"
        style={{ position: "absolute", visibility: "hidden" }}
        alt=""
      />
      <div className="text-center w-full px-2">
        <h3 className="text-xs font-semibold text-cyan-300">Signup and earn 6,500 points</h3>
      </div>
    </div>
  </div>
);

// Fanatics
export const FanaticsCard = ({ compact = false }: { compact?: boolean }) => (
  <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
    <div className="flex flex-col items-center gap-1 h-full justify-between">
      <a
        rel="sponsored"
        href="https://fanatics.93n6tx.net/c/6232366/3065965/9663"
        target="_blank"
        className="block w-full relative flex-1 max-h-[85%]"
      >
        <img
          src="https://a.impactradius-go.com/display-ad/9663-3065965"
          alt="Fanatics"
          width="300"
          height="250"
          className={`rounded-lg w-full ${compact ? "max-h-full object-contain" : "object-contain h-full max-h-[300px]"}`}
        />
      </a>
      <img
        height="0"
        width="0"
        src="https://imp.pxf.io/i/6232366/3065965/9663"
        style={{ position: "absolute", visibility: "hidden" }}
        alt=""
      />
      <div className="text-center w-full px-2">
        <h3 className="text-xs font-semibold text-cyan-300">Earn 2,500 point after any purchase</h3>
      </div>
    </div>
  </div>
);

// Remitly
export const RemitlyCard = ({ compact = false }: { compact?: boolean }) => (
  <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
    <div className="flex flex-col items-center gap-1 h-full justify-between">
      <a
        rel="sponsored"
        href="https://remitly.tod8mp.net/c/6232366/1417999/10408"
        target="_blank"
        className="block w-full relative flex-1"
      >
        <img
          src="https://a.impactradius-go.com/display-ad/10408-1417999"
          alt="Remitly"
          width="320"
          height="120"
          className={`rounded-lg w-full object-contain ${compact ? "max-h-[200px]" : "max-h-[100px]"}`}
        />
      </a>
      <img
        height="0"
        width="0"
        src="https://imp.pxf.io/i/6232366/1417999/10408"
        style={{ position: "absolute", visibility: "hidden" }}
        alt=""
      />
      <div className="text-center w-full px-2">
        <h3 className="text-xs font-semibold text-cyan-300">Earn 2,500 points for signing up</h3>
      </div>
    </div>
  </div>
);
