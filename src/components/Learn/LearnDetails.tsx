import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { IoBookSharp } from "react-icons/io5";
import Link from "next/link";

interface ParamsType {
    id: string;
}

interface ParamsParams {
    params: ParamsType;
}

const LearnDetailsPage = ({ params }: ParamsParams) => {


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
            title: "When is the best time to invest in crypto?",
            cryptoQuestion: "Understanding Blockchain Technology?",
            description:
                "Investment Strategies: HODLing: This long-term strategy encourages investors to hold their assets during market fluctuations, betting on the long-term appreciation of their investments. Active Trading: Traders analyze market trends, using technical analysis to inform their buying and selling decisions. This requires knowledge of chart patterns and market indicators. Fundamental Analysis: To assess a cryptocurrency’s value: Use Case Evaluation: Determine if the project addresses a real-world problem or need. Strong use cases can drive adoption and price appreciation. Market Sentiment: Monitor news and community discussions to gauge sentiment. Positive developments can lead to bullish trends, while negative news can trigger sell-offs. Technical Analysis: Traders study price charts to predict future movements: Candlestick Patterns: Understanding patterns like dojis, hammers, and engulfing candles can provide insights into market sentiment. Indicators: Common tools include the Relative Strength Index (RSI), which identifies overbought or oversold conditions, and Moving Averages, which help identify trend direction. Risk Management Techniques: Diversification: Spread investments across multiple assets to reduce the impact of volatility on your portfolio. Stop-Loss Orders: Set predefined price points at which to sell assets to limit potential losses. This disciplined approach helps protect profits.",
            image:
                "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
            type: "Basics"
        },
        {
            "id": 5,
            title: "When is the best time to invest in crypto?",
            cryptoQuestion: "Understanding Blockchain Technology?",
            description:
                "Overview of DeFi: Decentralized Finance (DeFi) leverages blockchain technology to recreate traditional financial systems without intermediaries. It encompasses lending, borrowing, trading, and earning interest through decentralized applications. Key Platforms and Services: Uniswap: A leading decentralized exchange that enables users to swap tokens directly from their wallets using liquidity pools. Users can provide liquidity and earn fees in return. Aave: A decentralized lending platform where users can lend and borrow assets without intermediaries. Aave introduces innovative features like flash loans, allowing users to borrow without collateral for instant transactions. Benefits of DeFi: Access: DeFi platforms are accessible to anyone with an internet connection, providing financial services to unbanked populations. Transparency: All transactions are recorded on the blockchain, promoting accountability and reducing fraud. Risks: Smart Contract Vulnerabilities: Bugs in smart contracts can lead to exploits, resulting in significant financial losses. Users should carefully assess the security audits of protocols before participating. Market Volatility: DeFi tokens can experience extreme price fluctuations, impacting collateralized loans and potentially leading to liquidations. Future Prospects: As DeFi matures, it could revolutionize financial services, introducing innovations such as decentralized insurance and automated trading. Regulatory developments will play a crucial role in shaping its future.",
            image:
                "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
            type: "Chapter-1"
        },
        {
            "id": 6,
            title: "When is the best time to invest in crypto?",
            cryptoQuestion: "Understanding Blockchain Technology?",
            description:
                "Software Wallets: Wallets like Exodus and Trust Wallet provide user-friendly interfaces for beginners. They allow easy access to funds but require secure backups to protect against loss or theft. Hardware Wallets: Devices like Ledger Nano X or Trezor One offer cold storage, making them ideal for long-term investors. These wallets are more secure but require initial setup and management. Step-by-Step Guide to Buying Cryptocurrency: Choose an Exchange: Research exchanges for security features, fees, and supported cryptocurrencies. Coinbase is known for its user-friendly interface, while Binance offers a vast selection of altcoins. Create an Account: Sign up and complete identity verification (KYC) to comply with regulations. This typically involves submitting identification documents. Deposit Funds: Fund your account via bank transfer, credit card, or cryptocurrency. Be mindful of transaction fees and processing times. Make Your Purchase: Select the cryptocurrency, input the amount, and review the transaction. Consider using limit orders to set specific buying prices. Tips for First-Time Buyers: Start Small: Begin with a manageable investment to reduce risk while you familiarize yourself with the market. Research Projects: Thoroughly evaluate the project’s whitepaper, team, and community support. Understanding the fundamentals can guide your investment decisions.",
            image:
                "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
            type: "Chapter-2"
        },
        {
            "id": 7,
            title: "When is the best time to invest in crypto?",
            cryptoQuestion: "Understanding Blockchain Technology?",
            description:
                "Definition and Purpose: Stablecoins are digital currencies pegged to stable assets like fiat currencies or commodities. Their primary aim is to provide stability in a highly volatile market. Types of Stablecoins: Fiat-Backed Stablecoins: These are pegged to fiat currencies and are backed by reserves. Examples include Tether (USDT) and USD Coin (USDC), both pegged to the US dollar. Crypto-Backed Stablecoins: These are backed by other cryptocurrencies, using over-collateralization to maintain stability. Examples include DAI, which is pegged to the US dollar but backed by Ethereum. Algorithmic Stablecoins: These use algorithms to control supply and demand, adjusting the coin's supply based on market conditions. TerraUSD (UST) is an example, although it faced significant challenges in maintaining its peg. Benefits: Liquidity: Stablecoins provide liquidity in the cryptocurrency market, allowing traders to move in and out of positions without converting to fiat. Ease of Use: They facilitate transactions in the crypto ecosystem, providing a stable medium for trading and remittances. Risks: Regulatory Concerns: As stablecoins grow, they attract scrutiny from regulators, which could impact their operations and usage. Trust and Transparency: Users must trust that issuers maintain adequate reserves. Transparency in reserve management is critical to maintaining confidence in stablecoins.",
            image:
                "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
            type: "Chapter-2"
        },
        {
            "id": 8,
            title: "When is the best time to invest in crypto?",
            cryptoQuestion: "Understanding Blockchain Technology?",
            description:
                "Decentralization: Traditional financial systems are hierarchical, requiring trust in intermediaries like banks. Cryptocurrencies eliminate this dependency by utilizing peer-to-peer networks, where users have full control over their funds. Security: Cryptography secures transactions, making it virtually impossible to counterfeit or double-spend coins. Each transaction is verified by network participants, adding an extra layer of security. Anonymity and Pseudonymity: Users can transact without revealing their real identities, offering varying degrees of privacy. While blockchain records are public, personal information is not linked to wallet addresses. Historical Context: The idea of digital currency was proposed as early as the 1980s with concepts like DigiCash, but it wasn’t until Bitcoin’s creation in 2009 by an anonymous person or group known as Satoshi Nakamoto that a viable model emerged. Bitcoin's underlying technology, blockchain, allowed for secure and transparent transactions without a central authority. Significance: Cryptocurrencies have the potential to disrupt traditional financial systems, democratizing access to financial services, especially in developing regions. They empower individuals with financial sovereignty, enabling them to bypass centralized financial institutions and retain control over their assets. Future Outlook: As technology evolves, cryptocurrencies could lead to innovations in various sectors, from finance to governance. The rise of central bank digital currencies (CBDCs) reflects the growing acceptance of digital currencies, potentially leading to a hybrid financial ecosystem.",
            image:
                "https://i0.wp.com/picjumbo.com/wp-content/uploads/bitcoin-mining-free-photo.jpg?w=600&quality=80",
            type: "Chapter-2"
        },
    ]
    const currentItemId = Number(params.id)
    const currentItem = cryptoTypesAndCryptoBasics.find((item) => item.id === currentItemId)
    return (
        <div className="bg-transparent mt-20">
            <h1 className=" font-bold text-white flex items-center gap-2 text-xl ">
                <IoBookSharp className=" text-cyan-500 size-9 ml-6" />
                <Link className="hover:text-cyan-600" href={"/learn"}> Learns</Link> /-<Link href={"/articles"} className="cursor-pointer hover:text-cyan-500 transition-all"> {currentItem?.type}</Link></h1>
            {" "}
            {/* Set background to transparent */}
            <Card className="max-w-4xl mx-auto bg-transparent border-none text-white">
                {" "}
                {/* Ensure Card has no background */}
                <CardHeader>
                    <CardTitle className="text-3xl md:text-4xl text-center font-bold">
                        {currentItem?.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                        <Image
                            src={(currentItem?.image as string)}
                            alt="Hand holding a bitcoin against roses"
                            className="object-cover hover:scale-105 transition-all duration-300"
                            fill
                            sizes="(max-width: 768px) 100vw, 800px"
                            priority
                        />
                    </div>
                    <div className="prose prose-gray max-w-none">
                        <p className="text-white leading-relaxed text-2xl font-semibold">
                            {currentItem?.cryptoQuestion}
                        </p>
                        <p className="text-white leading-relaxed">
                            {currentItem?.description}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LearnDetailsPage;
