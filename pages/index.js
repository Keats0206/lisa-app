import Layout from "../components/Layout"; // Layout
import Image from "next/image";
import NFT from "../components/NFT";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import styles from "../styles/pages/Home.module.scss";
import { web3 } from "../containers/index"; // Web3 container
import { useState, useEffect } from "react";
import { fetchEditions } from "../data/web3data";

export default function Home() {
  const [editions, setEditions] = useState(null);
  
  const { nfts } = web3.useContainer();

  useEffect(() => {
    setEditions(nfts);
  }, [nfts]);

  return (
    <Layout>
      {editions ? (
        <div>
          {editions.filter(nft => nft.salePrice > 0).map((nft, id) => {
            return <NFT key={id} nft={nft} />;
          })}
        </div>
      ) : (
        <Loading />
      )}
      <div className={styles.background}>
        <Image src="/logo_purple.png" alt="11 LIT3S Logo" height={800} width={800} />
      </div>
      <Footer />
    </Layout>
  );
}