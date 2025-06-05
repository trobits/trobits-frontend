"use client";
import TransparentCard from "./CryptoCard/CryptoCard";
import shibaInu from "../../assets/icons/shiba-inu.png";
import Lunc from "../../assets/icons/lunc.png";
import {
  useGetLuncInformationQuery,
  useGetShibaInformationQuery,
} from "@/redux/features/api/currencyApi";
import Loading from "../Shared/Loading";

export default function CryptoData() {
  const { data: shibaInformation, isLoading: shibaDataLoading } =
    useGetShibaInformationQuery("");
  const { data: luncInformation, isLoading: luncDataLoading } =
    useGetLuncInformationQuery("");

  if (shibaDataLoading || luncDataLoading) {
    return <Loading />;
  }

  const shibaData = shibaInformation?.data;
  const luncData = luncInformation?.data;

  const cardData = [
    {
      coin: "SHIB",
      shibPrice: "0.000016939",
      luncPrice: "0",
      interval: "1 Day",
      icon: shibaInu,
      visits: shibaData?.visits,
      revenue: shibaData?.revenue,
      burns: shibaData?.burns,
      visits7Day: shibaData?.visits7Day,
      revenue7Day: shibaData?.revenue7Day,
      burns7Day: shibaData?.burns7Day,
      visits30Day: shibaData?.visits30Day,
      revenue30Day: shibaData?.revenue30Day,
      burns30Day: shibaData?.burns30Day,
    },
    {
      coin: "LUNC",
      icon: Lunc,
      shibPrice: "0",
      luncPrice: "0.000090378",
      interval: "7 Days",
      visits: luncData?.visits,
      revenue: luncData?.revenue,
      burns: luncData?.burns,
      visits7Day: luncData?.visits7Day,
      revenue7Day: luncData?.revenue7Day,
      burns7Day: luncData?.burns7Day,
      visits30Day: luncData?.visits30Day,
      revenue30Day: luncData?.revenue30Day,
      burns30Day: luncData?.burns30Day,
    },
    {
      coin: "SHIB",
      shibPrice: "0.000016939",
      luncPrice: "0",
      interval: "1 Day",
      icon: shibaInu,
      visits: shibaData?.visits,
      revenue: shibaData?.revenue,
      burns: shibaData?.burns,
      visits7Day: shibaData?.visits7Day,
      revenue7Day: shibaData?.revenue7Day,
      burns7Day: shibaData?.burns7Day,
      visits30Day: shibaData?.visits30Day,
      revenue30Day: shibaData?.revenue30Day,
      burns30Day: shibaData?.burns30Day,
    },
    {
      coin: "LUNC",
      icon: Lunc,
      shibPrice: "0",
      luncPrice: "0.000090378",
      interval: "7 Days",
      visits: luncData?.visits,
      revenue: luncData?.revenue,
      burns: luncData?.burns,
      visits7Day: luncData?.visits7Day,
      revenue7Day: luncData?.revenue7Day,
      burns7Day: luncData?.burns7Day,
      visits30Day: luncData?.visits30Day,
      revenue30Day: luncData?.revenue30Day,
      burns30Day: luncData?.burns30Day,
    },
    {
      coin: "SHIB",
      shibPrice: "0.000016939",
      luncPrice: "0",
      interval: "1 Day",
      icon: shibaInu,
      visits: shibaData?.visits,
      revenue: shibaData?.revenue,
      burns: shibaData?.burns,
      visits7Day: shibaData?.visits7Day,
      revenue7Day: shibaData?.revenue7Day,
      burns7Day: shibaData?.burns7Day,
      visits30Day: shibaData?.visits30Day,
      revenue30Day: shibaData?.revenue30Day,
      burns30Day: shibaData?.burns30Day,
    },
  ];

  return (
    <section className="container mx-auto mt-28 px-0">
      <div className="flex justify-center flex-wrap items-center gap-10 perspective-1000">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`relative transform-gpu transition-transform duration-500 ease-out `}
          >
            <TransparentCard cryptoData={card} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
