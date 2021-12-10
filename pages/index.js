import Layout from "../components/Layout"; // Layout
import NFT from "../components/NFT";
import Loading from "../components/Loading";
import styles from "../styles/pages/Home.module.scss";
import { web3 } from "../containers/index"; // Web3 container
import { useState, useEffect } from "react";
import { fetchEditions } from "../data/web3data";

export default function Home() {
  const [nfts, setNFTs] = useState(null);
  const { fetchEditions } = web3.useContainer();

  const handleFetchEdition = async () => {
    const editions = await fetchEditions(
      process.env.NEXT_PUBLIC_ADMIN_WALLET
    );
    setNFTs(editions);
  };

  useEffect(() => {
    handleFetchEdition();
  }, []);

  return (
    <Layout>
      {nfts ? (
        <div>
          {nfts.map((nft, id) => {
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

// export async function getServerSideProps() {
//   return {
//     props: {nfts: await fetchEditionsCreator()},
//   }
// }
