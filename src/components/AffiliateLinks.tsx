import React from "react";

export const PrintrendyCard = () => {
  const base = 15,
    bonus = 25;
  const total = (base * bonus) / 100;

  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full">
      <div className="flex flex-col items-center gap-1">
        <a
          rel="sponsored"
          href="https://printrendy.pxf.io/c/6232366/1453720/17020"
          target="_top"
          className="block w-full relative"
        >
          <img
            src="https://a.impactradius-go.com/display-ad/17020-1453720"
            alt="Printrendy Online Sale"
            width="235"
            height="300"
            className="rounded-lg w-full h-[300px] object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <div className="hidden absolute inset-0 bg-slate-700 rounded-lg flex items-center justify-center p-4">
            <p className="text-white text-center font-semibold">
              Printrendy
              <br />
              {total}% Commission
            </p>
          </div>
        </a>
        <img
          height="0"
          width="0"
          src="https://imp.pxf.io/i/6232366/1453720/17020"
          style={{ position: "absolute", visibility: "hidden" }}
          alt=""
        />
        <div className="text-center w-full">
          <h3 className="text-base font-semibold text-cyan-300">Printrendy</h3>
          <div className="bg-slate-700/50 p-1 rounded-lg">
            <p className="text-sm text-slate-300">First-time Commission</p>
            <p className="text-green-400 font-bold text-base">{total}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GeminiCard = () => {
  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full">
      <div className="flex flex-col items-center gap-1">
        <a
          rel="sponsored"
          href="https://gemini.sjv.io/c/6232366/2794807/11829"
          target="_top"
          className="block w-full relative"
        >
          <img
            src="https://a.impactradius-go.com/display-ad/11829-2794807"
            alt="Gemini Exchange"
            width="470"
            height="300"
            className="rounded-lg w-full h-[300px] object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <div className="hidden absolute inset-0 bg-slate-700 rounded-lg flex items-center justify-center p-4">
            <p className="text-white text-center font-semibold">
              Gemini Exchange
              <br />
              $10 Commission
            </p>
          </div>
        </a>
        <img
          height="0"
          width="0"
          src="https://imp.pxf.io/i/6232366/2794807/11829"
          style={{ position: "absolute", visibility: "hidden" }}
          alt=""
        />
        <div className="text-center w-full">
          <h3 className="text-base font-semibold text-cyan-300">Gemini</h3>
          <div className="bg-slate-700/50 p-1 rounded-lg">
            <p className="text-sm text-slate-300">First-time Commission</p>
            <p className="text-green-400 font-bold text-base">$10.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UrsimeCard = () => {
  const base = 2,
    bonus = 25;
  const total = (base * bonus) / 100;

  return (
    <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 w-full">
      <div className="flex flex-col items-center gap-1">
        <a
          rel="sponsored"
          href="https://ursime.pxf.io/c/6232366/2889438/16384"
          target="_top"
          className="block w-full relative"
        >
          <img
            src="https://a.impactradius-go.com/display-ad/16384-2889438"
            alt="Ursime Online Sale"
            width="235"
            height="300"
            className="rounded-lg w-full h-[300px] object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <div className="hidden absolute inset-0 bg-slate-700 rounded-lg flex items-center justify-center p-4">
            <p className="text-white text-center font-semibold">
              Ursime
              <br />
              {total}% Commission
            </p>
          </div>
        </a>
        <img
          height="0"
          width="0"
          src="https://imp.pxf.io/i/6232366/2889438/16384"
          style={{ position: "absolute", visibility: "hidden" }}
          alt=""
        />
        <div className="text-center w-full">
          <h3 className="text-base font-semibold text-cyan-300">Ursime</h3>
          <div className="bg-slate-700/50 p-1 rounded-lg">
            <p className="text-sm text-slate-300">First-time Commission</p>
            <p className="text-green-400 font-bold text-base">{total}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
