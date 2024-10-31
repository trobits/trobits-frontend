import Image from "next/image";
import Link from "next/link";

function ArticlePage() {
  return (
    <div>
      {/* Centered Image Container */}
      <div className="flex justify-center min-w-[1440px] h-[300px] mx-auto overflow-hidden">
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTppCXNy_Dfaj5sd8F9v0f5no1OFpwvf8q3YFUeE6mHnhgpek9DvOxMhkd5Cd8MoIlaswg&usqp=CAU" // Replace with the actual path of your image
          alt="Metallic green and gold surface"
          width={1440}
          height={300}
          className="object-cover"
        />
      </div>
      <div className="bg-gray-950 text-white">
        {/* Content */}
        <div className="px-4 md:px-6 lg:px-8 max-w-6xl mx-auto mt-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6 text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link
              href="/articles"
              className="hover:text-white transition-colors"
            >
              ARTICLES
            </Link>
          </nav>

          {/* Title and Author */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              How NFT Transformers Pop is Revolutionizing Collectible Culture?
            </h1>
            <p className="text-xl text-gray-400">by: Hira Usman</p>
          </div>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">
              It was once the Non-Fungible tokens (NFTs) were causing irritation
              to most industries, changing the face of art in the digital world
              and the scope of gaming. It goes beyond that since the
              non-fungible tokens will now bring waves into the collectible
              world, changing the way collectors view their favorite items with
              regards to ownership, uniqueness, and authenticity through a
              digital bind of ownership. One of the most exciting trends in this
              evolving scenario is NFT Transformers Pop: nostalgia combined with
              cutting-edge technology through blockchain and NFTs. It s
              revolutionizing collectibles by opening the doors for creators and
              collectors alike.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              What are NFT Transformers Pop?
            </h2>

            <p className="text-gray-300 leading-relaxed">
              NFT Transformers Pop is the series of digital collectibles
              inspired by the apparently impenetrable and extremely realistic
              Transformers franchise. These are NFTs, unique and verifiable
              assets stored on a blockchain. While other collectibles may be
              physical, these digital assets can be bought, sold, and traded
              online, allowing fans to own rare, exclusive, and unique
              Transformers items. Every NFT Transformer Pop may range from
              classic model depictions of Optimus Prime and Bumblebee to new,
              custom designs where the physical and digital worlds collide.
            </p>

            <p className="text-gray-300 leading-relaxed">
              These NFTs vary from static digital images to animated characters
              and interactive elements unlocked as owners interact with them.
              The digital uniqueness, therefore, in terms of rarity, ensures
              that the items are highly sought after within the collectibles
              industry.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              NFT Transformers Pop vs Traditional Collectibles
            </h2>

            <h3 className="text-xl font-bold mt-6 mb-3">
              Ownership and Security
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticlePage;
