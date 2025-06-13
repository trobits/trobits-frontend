"use client";
import Script from "next/script";

export const SideAd = () => {
  return (
    <>
      <div style={{ height: "300px", width: "100%", display: "block" }}></div>
      <ins
        className="67b008e690c926b6d6b98939"
        style={{
          display: "inline-block",
          width: "1px",
          height: "1px",
        }}
      ></ins>
      <Script
        id="side-ad-banner-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(e,n,c,t,o,r,d){
              !function e(n,c,t,o,r,m,d,s,a){
                s=c.getElementsByTagName(t)[0],
                (a=c.createElement(t)).async=!0,
                a.src="https://"+r[m]+"/js/"+o+".js?v="+d,
                a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},
                s.parentNode.insertBefore(a,s)
              }(window,document,"script","67b008e690c926b6d6b98939",["cdn.bmcdn6.com"], 0, new Date().getTime())
            }();
          `,
        }}
      />
    </>
  );
};
