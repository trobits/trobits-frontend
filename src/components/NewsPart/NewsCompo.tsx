// pages/index.js
import Link from "next/link";
import { Button } from "../ui/button";
import NewsCard from "./NewsCard";
import { useGetAllBlogsQuery } from "@/redux/features/api/articleApi";
import Loading from "../Shared/Loading";
import { Article } from "@/app/(withCommonLayout)/articles/page";
import Script from "next/script";




export function AdBannerA() {
  return (
    <>
      {/* Ad banner */}
      <ins
        className="67b00b6de904d5920e690b84"
        style={{ display: "inline-block", width: "1px", height: "1px" }}
      ></ins>
      <Script
        id="ad-banner-script"
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
              }(window,document,"script","67b00b6de904d5920e690b84",["cdn.bmcdn6.com"], 0, new Date().getTime())
            }();
          `,
        }}
      />
    </>
  );
}
export default function NewsCompo() {
  const { data: allBlogsData, isLoading: allBlogsDataLoading } = useGetAllBlogsQuery([]);
  if (allBlogsDataLoading) {
    return <Loading />
  }

  const allBlogs: Article[] = allBlogsData?.data;

  return (
    <div>
      <div className="container mx-auto mt-10">
        <h2 className=" text-2xl text-center mb-6 font-bold text-cyan-600">Trobits Articles</h2>

        <div className="flex flex-wrap justify-center gap-2 max-w- mx-auto">
          {allBlogs?.slice(0, 8).map((article, index) => (

            <div key={article.id}>
              <NewsCard articleData={article} />
              {/* Insert 4 ads every 4 NewsCards */}
              {(index + 1) % 4 === 0 && (
                <>
                  <AdBannerA />
                  <AdBannerA />
                  <AdBannerA />
                  <AdBannerA />
                </>
              )}

            </div>
            
          ))}
        </div>
      </div>
      <Link href="/articles">
        <div className="text-center mt-20">
          <Button className="mx-auto bg-cyan-700  text-white">See More</Button>
        </div>
      </Link>
    </div>
  );
}
