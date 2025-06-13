import React from 'react';

export const GeminiAffiliateBanner = () => {
  return (
    <div className="flex flex-col items-center gap-0.5 p-0.5 bg-slate-800 rounded-lg shadow-lg border border-slate-700 max-w-md mx-auto">
      <div className="relative w-full">
        <a 
          rel="sponsored"
          href="https://gemini.sjv.io/c/6232366/2794807/11829" 
          target="_top" 
          id="2794807"
          className="block"
        >
          <img 
            src="//a.impactradius-go.com/display-ad/11829-2794807" 
            alt="Gemini Exchange" 
            width="400" 
            height="225"
            className="w-full h-auto rounded-lg"
          />
        </a>
        <img 
          height="0" 
          width="0" 
          src="https://imp.pxf.io/i/6232366/2794807/11829" 
          style={{ position: 'absolute', visibility: 'hidden' }} 
          alt=""
        />
      </div>
      
      <div className="text-center space-y-0.5 w-full">
        <h3 className="text-xs font-semibold text-cyan-300">Promote and earn</h3>
        <div className="grid grid-cols-2 gap-0.5 text-[10px]">
          <div className="bg-slate-700/50 p-0.5 rounded-lg border border-slate-600">
            <p className="font-medium text-slate-300">First Trade</p>
            <p className="text-green-400 font-bold">Earn $10.00</p>
          </div>
          <div className="bg-slate-700/50 p-0.5 rounded-lg border border-slate-600">
            <p className="font-medium text-slate-300">Account Signup</p>
            <p className="text-green-400 font-bold">Earn $0.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 