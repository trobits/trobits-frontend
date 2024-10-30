import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface ParamsType {
  id: string;
}

interface ParamsParams {
  params: ParamsType;
}

const LearnDetailsPage = ({ params }: ParamsParams) => {
  console.log(params);
  return (
    <div className="bg-transparent mt-20">
      {" "}
      {/* Set background to transparent */}
      <Card className="max-w-4xl mx-auto bg-transparent border-none text-white">
        {" "}
        {/* Ensure Card has no background */}
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl text-center font-bold">
            When is the best time to invest in crypto?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src="https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80"
              alt="Hand holding a bitcoin against roses"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground leading-relaxed text-2xl font-semibold">
            the best time to invest in crypto
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Follow the simple instructions to set up your wallet – which is a
              place you can keep some of your crypto, a place to send or receive
              it, and your portal to the growing universe of crypto apps. (You
              can also download this Chrome extension to connect Coinbase Wallet
              to a web browser if you d rather browse NFTs on a computer). There
              are lots of NFT markets, from Rarible or OpenSea to MagicEden and
              Blur. Get browsing! Prices range from essentially free to hundreds
              of thousands of dollars or more for a rare item. Some items are
              sold via auction, while others can be snagged immediately via a
              Buy now button. Even if the NFT is free or cheap, you ll still
              have to pay fees to make the transaction happen. Gas prices rise
              and fall depending on how busy the network is. Choose an NFT you
              like and make sure you have extra ETH to cover fees. Once you buy
              it, you can access the NFT via your crypto wallet until you decide
              to sell it.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnDetailsPage;
