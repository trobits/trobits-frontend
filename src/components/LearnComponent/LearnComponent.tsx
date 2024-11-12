import Image from "next/image";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

interface TCryptoData {
  id?: number;
  cryptoQuestion: string;
  chapter?: string;
  title: string;
  description: string;
  image: string;
}
interface TCryptoDataProps {
  title: string;
  cryptoBasic: TCryptoData[];
}
const LearnComponent = ({ title, cryptoBasic }: TCryptoDataProps) => {
  return (
    <div className=" p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-12">
        {title}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {cryptoBasic.map((item, index) => (
          <Link key={index} href={`/learn/${item?.id}`}>
            <Card


              className="bg-[#00000050]  border-none transition-all duration-300 overflow-hidden group"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <Image
                  src={item?.image}
                  alt={item?.title}
                  height={300}
                  width={300}
                  className="w-full h-full object-cover transition-transform duration-300 rounded-b-xl group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="text-sm text-blue-400 mb-2">{item?.chapter}</div>
                <CardTitle className="text-xl text-white mb-2">
                  {item?.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {item?.description?.slice(0, 50)}{(item?.description?.length > 50) ? "..." : ""}
                </p>
              </CardContent>
              <Button className="bg-cyan-700 text-white m-4">Details</Button>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default LearnComponent;
