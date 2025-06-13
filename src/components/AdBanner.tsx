"use client";

import { useEffect, useRef } from "react";

export const AdBanner = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adRef.current;

    if (!container) return;

    container.innerHTML = `
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

