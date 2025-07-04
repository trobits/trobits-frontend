import React from "react";
import smgImg from "@/assets/smg.png";

const CARD_IMAGE_HEIGHT = "h-[300px]";

export const GeminiCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-1 h-full justify-between">
        <a
          rel="sponsored"
          href="https://gemini.sjv.io/c/6232366/2794807/11829"
          target="_top"
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
          <h3 className="text-base font-semibold text-cyan-300">Gemini</h3>
        </div>
      </div>
    </div>
  );
};

export const PrintrendyCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-1 h-full justify-between">
        <a
          rel="sponsored"
          href="https://printrendy.pxf.io/c/6232366/1453719/17020"
          target="_top"
          className="block w-full relative flex-1"
        >
          <img
            src="https://a.impactradius-go.com/display-ad/17020-1453719"
            alt="Printrendy Online Sale"
            width="300"
            height="250"
            className={`rounded-lg w-full ${compact ? "h-20 object-cover" : 'object-contain h-full max-h-[300px]'}`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
                  </a>
        <img
          height="0"
          width="0"
          src="https://imp.pxf.io/i/6232366/1453719/17020"
          style={{ position: "absolute", visibility: "hidden" }}
          alt=""
        />
        <div className="text-center w-full px-2">
          <h3 className="text-base font-semibold text-cyan-300">Printrendy</h3>
        </div>
      </div>
    </div>
  );
};

export const UrsimeCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-1 h-full justify-between">
        <a
          rel="sponsored"
          href="https://ursime.pxf.io/c/6232366/1390298/16384"
          target="_top"
          className="block w-full relative flex-1"
        >
          <img
            src="https://a.impactradius-go.com/display-ad/16384-1390298"
            alt="Ursime Online Sale"
            width="1920"
            height="800"
            className={`rounded-lg w-full object-contain h-full max-h-[300px]`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
                  </a>
        <img
          height="0"
          width="0"
          src="https://imp.pxf.io/i/6232366/1390298/16384"
          style={{ position: "absolute", visibility: "hidden" }}
          alt=""
        />
        <div className="text-center w-full px-2">
          <h3 className="text-base font-semibold text-cyan-300">Ursime</h3>
        </div>
      </div>
    </div>
  );
};

export const PreplyCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-1 h-full justify-between">
        <a
          rel="sponsored"
          href="https://preply.sjv.io/c/6232366/2037662/24422"
          target="_top"
          className="block w-full relative flex-1"
        >
          <img
            src="https://a.impactradius-go.com/display-ad/24422-2037662"
            alt="Preply Online Sale"
            width="300"
            height="50"
            className={`rounded-lg w-full object-contain h-full max-h-[300px]`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        </a>
        <img
          height="0"
          width="0"
          src="https://imp.pxf.io/i/6232366/2037662/24422"
          style={{ position: "absolute", visibility: "hidden" }}
          alt=""
        />
        <div className="text-center w-full px-2">
          <h3 className="text-base font-semibold text-cyan-300">Preply</h3>
        </div>
      </div>
    </div>
  );
};

export const NordVPNCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-1 h-full justify-between">
        <a
          rel="sponsored"
          href="https://nordvpn.sjv.io/c/6232366/2185832/7452"
          target="_top"
          className="block w-full relative flex-1"
        >
          <img
            src="https://a.impactradius-go.com/display-ad/7452-2185832"
            alt="NordVPN"
            width="320"
            height="280"
            className={`rounded-lg w-full object-contain h-full max-h-[300px]`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        </a>
        <img
          height="0"
          width="0"
          src="https://nordvpn.sjv.io/i/6232366/2185832/7452"
          style={{ position: "absolute", visibility: "hidden" }}
          alt=""
        />
        <div className="text-center w-full px-2">
          <h3 className="text-base font-semibold text-cyan-300">NordVPN</h3>
        </div>
      </div>
    </div>
  );
};

export const FanaticsCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-1 h-full justify-between">
        <a
          rel="sponsored"
          href="https://fanatics.93n6tx.net/c/6232366/3065965/9663"
          target="_top"
          className="block w-full relative flex-1"
        >
          <img
            src="https://a.impactradius-go.com/display-ad/9663-3065965"
            alt="Fanatics"
            width="300"
            height="250"
            className={`rounded-lg w-full object-contain h-full max-h-[300px]`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
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
          <h3 className="text-base font-semibold text-cyan-300">Fanatics</h3>
        </div>
      </div>
    </div>
  );
};

export const RemitlyCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-1 h-full justify-between">
        <a
          rel="sponsored"
          href="https://remitly.tod8mp.net/c/6232366/1417999/10408"
          target="_top"
          className="block w-full relative flex-1"
        >
          <img
            src="https://a.impactradius-go.com/display-ad/10408-1417999"
            alt="Remitly"
            width="320"
            height="480"
            className={`rounded-lg w-full object-contain h-full max-h-[300px]`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
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
          <h3 className="text-base font-semibold text-cyan-300">Remitly</h3>
        </div>
      </div>
    </div>
  );
};

export const StockMarketGuidesCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-1 h-full justify-between">
        <a
          rel="sponsored"
          href="https://stockmarketguides.sjv.io/c/6232366/1863442/20465"
          target="_top"
          className="block w-full relative flex-1"
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
          <h3 className="text-base font-semibold text-cyan-300">Stock Market Guides</h3>
        </div>
      </div>
    </div>
  );
};

export const TicketNetworkCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-1 h-full justify-between">
        <a
          rel="sponsored"
          href="https://ticketnetwork.lusg.net/c/6232366/1728828/2322"
          target="_top"
          className="block w-full relative flex-1"
        >
          <img
            src="https://d3b7ca3kks92i5.cloudfront.net/performer/113/113-tn-300x250.jpg"
            alt="TicketNetwork"
            width="300"
            height="250"
            className={`rounded-lg w-full object-contain h-full max-h-[300px]`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        </a>
        <img
          height="0"
          width="0"
          src="https://ticketnetwork.lusg.net/i/6232366/1728828/2322"
          style={{ position: "absolute", visibility: "hidden" }}
          alt=""
        />
        <div className="text-center w-full px-2">
          <h3 className="text-base font-semibold text-cyan-300">TicketNetwork</h3>
        </div>
      </div>
    </div>
  );
};

export const CPRCareCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-1 h-full justify-between">
        <a
          rel="sponsored"
          href="https://cprcare.pxf.io/c/6232366/3043520/33573"
          target="_top"
          className="block w-full relative flex-1"
        >
          <img
            src="https://a.impactradius-go.com/display-ad/33573-3043520"
            alt="CPRCare"
            width="800"
            height="800"
            className={`rounded-lg w-full object-contain h-full max-h-[300px]`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        </a>
        <img
          height="0"
          width="0"
          src="https://imp.pxf.io/i/6232366/3043520/33573"
          style={{ position: "absolute", visibility: "hidden" }}
          alt=""
        />
        <div className="text-center w-full px-2">
          <h3 className="text-base font-semibold text-cyan-300">CPRCare</h3>
        </div>
      </div>
    </div>
  );
};

export const GolfPartnerCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-1 h-full justify-between">
        <a
          rel="sponsored"
          href="https://golfpartner.sjv.io/c/6232366/1442655/17026"
          target="_top"
          className="block w-full relative flex-1"
        >
          <img
            src="https://a.impactradius-go.com/display-ad/17026-1442655"
            alt="GolfPartner"
            width="512"
            height="512"
            className={`rounded-lg w-full object-contain h-full max-h-[300px]`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        </a>
        <img
          height="0"
          width="0"
          src="https://imp.pxf.io/i/6232366/1442655/17026"
          style={{ position: "absolute", visibility: "hidden" }}
          alt=""
        />
        <div className="text-center w-full px-2">
          <h3 className="text-base font-semibold text-cyan-300">GolfPartner</h3>
        </div>
      </div>
    </div>
  );
};

export const Wwwm8xcomCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-1 h-full justify-between">
        <a
          rel="sponsored"
          href="https://wwwm8xcom.pxf.io/c/6232366/2158003/26891"
          target="_top"
          className="block w-full relative flex-1"
        >
          <img
            src="https://a.impactradius-go.com/display-ad/26891-2158003"
            alt="wwwm8xcom"
            width="0"
            height="0"
            className={`rounded-lg w-full h-full object-contain max-h-[300px]`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        </a>
        <img
          height="0"
          width="0"
          src="https://imp.pxf.io/i/6232366/2158003/26891"
          style={{ position: "absolute", visibility: "hidden" }}
          alt=""
        />
        <div className="text-center w-full px-2">
          <h3 className="text-base font-semibold text-cyan-300">wwwm8xcom</h3>
        </div>
      </div>
    </div>
  );
};