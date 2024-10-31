import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import ComputerBitcoin from "@/assets/crypto-computer.png"
import BitcoinImage from "@/assets/bitcoin.png"
import LearnComponent from "@/components/LearnComponent/LearnComponent"

export default function LearnPage() {
    const cryptoTypesAndCryptoBasics = [
        {
            id: 1,
            chapter: "Chapter 1",
            cryptoQuestion: "Understanding Blockchain Technology?",
            title: "Understanding Blockchain Technology",
            description:
                "Blockchain is a decentralized ledger technology that records transactions across multiple computers. This ensures that the data is transparent, secure, and tamper-proof.",
            image:
                "https://www.shutterstock.com/image-vector/cryptocurrency-coins-banner-concept-digital-600nw-2049622757.jpg",
            type: "Chapter-6"
        },
        {
            id: 2,
            chapter: "Chapter 2",
            cryptoQuestion: "Understanding Blockchain Technology?",
            title: "Bitcoin: The Pioneer",
            description:
                "Bitcoin was designed as a decentralized digital currency, allowing users to transact directly with each other without intermediaries. Its fixed supply of 21 million coins creates digital scarcity, driving its value proposition.",
            image:
                "https://www.shutterstock.com/image-vector/cryptocurrency-coins-banner-concept-digital-600nw-2049622757.jpg",
            type: "Chapter-5"
        },
        {
            id: 3,
            chapter: "Chapter 4",
            title: "Exploring Altcoins",
            cryptoQuestion: "Understanding Blockchain Technology?",
            description:
                "Altcoins encompass all cryptocurrencies other than Bitcoin. They offer diverse features and functionalities, addressing specific use cases or technological advancements.",
            image:
                "https://www.shutterstock.com/image-vector/cryptocurrency-coins-banner-concept-digital-600nw-2049622757.jpg",
            type: "Tipes"
        }, {
            "id": 4,
            title: "Understanding Blockchain Technology",
            cryptoQuestion: "Understanding Blockchain Technology?",
            description:
                "Blockchain is a decentralized ledger technology that records transactions across multiple computers. This ensures that the data is transparent, secure, and tamper-proof.",
            image:
                "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
            type: "Basics"
        },
        {
            "id": 5,
            title: "Bitcoin: The Pioneer",
            cryptoQuestion: "Understanding Blockchain Technology?",
            description:
                "Bitcoin was designed as a decentralized digital currency, allowing users to transact directly with each other without intermediaries. Its fixed supply of 21 million coins creates digital scarcity, driving its value proposition.",
            image:
                "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
            type: "Chapter-1"
        },
        {
            "id": 6,
            title: "Exploring Altcoins",
            cryptoQuestion: "Understanding Blockchain Technology?",
            description:
                "Altcoins encompass all cryptocurrencies other than Bitcoin. They offer diverse features and functionalities, addressing specific use cases or technological advancements.",
            image:
                "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
            type: "Chapter-2"
        },
    ]
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Featured Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-white text-center mt-8">Featured</h2>
                <Card className="overflow-hidden bg-[#00000036] border border-cyan-400 text-white">
                    <CardContent className="p-0">
                        <div className="aspect-video relative">
                            <Image
                                src="https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80"
                                alt="Crypto investment chart with gold coins"
                                fill
                                className="object-cover rounded-md"
                            />
                            <div className="absolute top-4 left-4 text-white bg-[#00000033] px-3 py-1 rounded-full text-sm">
                                Video Tutorial
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <h3 className="text-2xl font-bold leading-tight">
                                When is the best time to invest in crypto?
                            </h3>
                            <p className="text-muted-foreground">
                                When prices are fluctuating, how do you know when to buy? Learn more about using dollar-cost averaging to weather price volatility.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/learnType/cryptoBasic" className="  flex items-center gap-2">
                                    <div className=" size-20 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Image src={ComputerBitcoin} alt="cmtbitcoin" className=" cursor-auto rounded-full text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium hover:text-cyan-500 transition-all duration-150">Crypto Basics</div>
                                        <div className="text-xs text-muted-foreground hover:text-cyan-500 transition-all duration-150">see more →</div>
                                    </div>
                                </Link>
                                <Link href="/learnType/cryptoTips" className="flex items-center gap-2 hover:text-cyan-500 transition-all duration-150">
                                    <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Image src={BitcoinImage} alt="cmtbitcoin" className=" cursor-auto rounded-full text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium hover:text-cyan-500 transition-all duration-150">Tips and Tutorial</div>
                                        <div className="text-xs text-muted-foreground hover:text-cyan-500 transition-all duration-150">see more →</div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section */}
            <div className="py-12 text-center space-y-4 text-white">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Cryptocurrency Unveiled: A Comprehensive Guide
                </h1>
                <p className="text-xl">
                    From Blockchain Basics to Investment Strategies and DeFi Innovations
                </p>
            </div>
            <div className=" w-full">

                <div>
                    <LearnComponent title={"Crypto Basics"} cryptoBasic={cryptoTypesAndCryptoBasics.slice(0,4)} />
                </div> 
                <div className=" flex items-center justify-center">

                <Link href={"/learnType/cryptoBasic"} className=" bg-cyan-500 text-white px-10 font-bold py-2 rounded-md mb-6 text-center">See More</Link>
                </div>
            </div>
        </div>
    )
}