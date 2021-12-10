import Layout from "../components/Layout"; // Layout
import NFT from "../components/NFT";
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
          {editions.map((nft, id) => {
            return <NFT key={id} nft={nft} />;
          })}
        </div>
      ) : (
        <Loading />
      )}
      <div className={styles.background}>
        <h1>11 LIT3S HOTEL</h1>
      </div>
    </Layout>
  );
}