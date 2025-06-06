"use client";

import { useEffect, useRef } from "react";

export const AdBanner = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adRef.current;

    if (!container) return;

    container.innerHTML = `
<div className="flex flex-col sm:flex-row gap-4 mt-2 text-sm text-center">
  <a href="https://nordvpn.sjv.io/2aXg2G" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">🌍 Secure your connection with NordVPN</a>
  <a href="https://gemini.sjv.io/N9oeeN" target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">💎 Trade Crypto on Gemini</a>
  <a href="https://godlikehost.sjv.io/vP100N" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">💻 Powerful Hosting by GodlikeHost</a>
</div>

      <ins class="67b008e690c926b6d6b98939"
        style="display:block;width:100%;height:90px;background:#f0f0f0;">
        <span style="color:#666;font-size:12px">Loading ad...</span>
      </ins>
    `;

    const script = document.createElement("script");
    script.src = "https://cdn.bmcdn6.com/js/67b008e690c926b6d6b98939.js";
    script.async = true;
    script.onerror = () => {
      console.warn("❌ Ad script failed to load");
    };

    container.appendChild(script); // ⬅️ Use container instead of document.body

    return () => {
      container.innerHTML = ""; // Clean up
    };
  }, []);

  return <div ref={adRef} />;
};

