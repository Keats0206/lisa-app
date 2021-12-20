import { useState, useEffect } from "react"; // React state
import Layout from "../components/Layout"; // Layout
import Image from "next/image"; // Next image support
import NFT from "../components/NFT"; // NFT Component
import Footer from "../components/Footer"; // Footer component
import Spinner from "../components/Spinner"; // Spinner loading component
import styles from "../styles/pages/Home.module.scss"; // Home styling
import { web3 } from "../containers/index"; // Web3 container

export default function Home() {
  const [editions, setEditions] = useState(null); // NFT state
  const { nfts } = web3.useContainer(); // Use NFTs from global state

  useEffect(() => {
    setEditions(nfts);
  }, [nfts]);

  return (
    <Layout>
      {/* Checking for editions data */}
      {editions ? (
        <div>
          {/* Only showing NFTs that have been set for sale on home page (price > 0) */}
          {editions.filter(nft => nft.salePrice > 0).map((nft, id) => {
            return <NFT key={id} nft={nft} />;
          })}
        </div>
      ) : (
        <div>
          {/* Spinner state */}
          <Spinner />
        </div>
      )}
      {/* Background logo for homepage */}
      <div className={styles.background}>
        <Image src="/logo_purple.png" alt="11 LIT3S Logo" height={800} width={800} />
      </div>
      <Footer />
    </Layout>
  );
}