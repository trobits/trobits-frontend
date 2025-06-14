import React from 'react';

export const AffiliateLinks = () => {
  // Printrendy calculations
  const printrendyBaseCommission = 15; // 15% base commission
  const printrendyFirstTimeBonus = 25; // 25% of the commission
  const printrendyFirstTimeTotal = (printrendyBaseCommission * printrendyFirstTimeBonus) / 100; // 3.75% for first-time

  // Ursime calculations
  const ursimeBaseCommission = 2; // 2% base commission
  const ursimeFirstTimeBonus = 25; // 25% of the commission
  const ursimeFirstTimeTotal = (ursimeBaseCommission * ursimeFirstTimeBonus) / 100; // 0.5% for first-time

  return (
    <div className="w-full bg-slate-900/50 py-1">
      <div className="max-w-7xl mx-auto px-1 flex justify-center">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-1 place-items-center">
            {/* Printrendy Affiliate */}
            <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 md:col-span-1.5 w-full">
              <div className="flex flex-col items-center gap-1">
                <a 
                  rel="sponsored"
                  href="https://printrendy.pxf.io/c/6232366/1453720/17020" 
                  target="_top" 
                  id="1453720"
                  className="block w-full relative"
                >
                  <img 
                    src="//a.impactradius-go.com/display-ad/17020-1453720" 
                    alt="Printrendy Online Sale - Get 3.75% commission on first-time purchases" 
                    width="235" 
                    height="300"
                    className="rounded-lg w-full h-[300px] object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-slate-700 rounded-lg flex items-center justify-center p-4">
                    <p className="text-white text-center">Printrendy Online Sale<br/>3.75% Commission</p>
                  </div>
                </a>
                <img 
                  height="0" 
                  width="0" 
                  src="https://imp.pxf.io/i/6232366/1453720/17020" 
                  style={{ position: 'absolute', visibility: 'hidden' }} 
                  alt=""
                />
                <div className="text-center w-full">
                  <h3 className="text-base font-semibold text-cyan-300">Online Sale</h3>
                  <div className="bg-slate-700/50 p-1 rounded-lg">
                    <p className="text-sm text-slate-300">First-time Commission</p>
                    <p className="text-green-400 font-bold text-base">{printrendyFirstTimeTotal}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gemini Affiliate */}
            <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 md:col-span-3 w-full">
              <div className="flex flex-col items-center gap-1">
                <a 
                  rel="sponsored"
                  href="https://gemini.sjv.io/c/6232366/2794807/11829" 
                  target="_top" 
                  id="2794807"
                  className="block w-full relative"
                >
                  <img 
                    src="//a.impactradius-go.com/display-ad/11829-2794807" 
                    alt="Gemini Exchange - Get $10 commission on first-time trades" 
                    width="470" 
                    height="300"
                    className="rounded-lg w-full h-[300px] object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-slate-700 rounded-lg flex items-center justify-center p-4">
                    <p className="text-white text-center">Gemini Exchange<br/>$10 Commission</p>
                  </div>
                </a>
                <img 
                  height="0" 
                  width="0" 
                  src="https://imp.pxf.io/i/6232366/2794807/11829" 
                  style={{ position: 'absolute', visibility: 'hidden' }} 
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

            {/* Ursime Affiliate */}
            <div className="bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-700 md:col-span-1.5 w-full">
              <div className="flex flex-col items-center gap-1">
                <a 
                  rel="sponsored"
                  href="https://ursime.pxf.io/c/6232366/2889438/16384" 
                  target="_top" 
                  id="2889438"
                  className="block w-full relative"
                >
                  <img 
                    src="//a.impactradius-go.com/display-ad/16384-2889438" 
                    alt="Ursime Online Sale - Get 0.5% commission on first-time purchases" 
                    width="235" 
                    height="300"
                    className="rounded-lg w-full h-[300px] object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-slate-700 rounded-lg flex items-center justify-center p-4">
                    <p className="text-white text-center">Ursime Online Sale<br/>0.5% Commission</p>
                  </div>
                </a>
                <img 
                  height="0" 
                  width="0" 
                  src="https://imp.pxf.io/i/6232366/2889438/16384" 
                  style={{ position: 'absolute', visibility: 'hidden' }} 
                  alt=""
                />
                <div className="text-center w-full">
                  <h3 className="text-base font-semibold text-cyan-300">Online Sale</h3>
                  <div className="bg-slate-700/50 p-1 rounded-lg">
                    <p className="text-sm text-slate-300">First-time Commission</p>
                    <p className="text-green-400 font-bold text-base">{ursimeFirstTimeTotal}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 