import { useState, useEffect } from "react";
import Layout from "../components/Layout"; // Layout
import Loading from "../components/Loading"; // Layout
import { web3 } from "../containers/index"; // Web3 container
import styles from "../styles/pages/Admin.module.scss"; // Component styles
import NFTAdmin from "../components/NFTAdmin";

export default function Admin({ editions }) {
  const [nfts, setNFTs] = useState([]);
  
  const {
    address,
    fetchEditionsCreator
  } = web3.useContainer();

  const handleFetchEdition = async () => {
    const editions = await fetchEditionsCreator(process.env.NEXT_PUBLIC_ADMIN_WALLET);
    setNFTs(editions);
  }

  useEffect(() => {
    handleFetchEdition();
  }, [])

  return (
    <Layout>
      {nfts ? (
              <>
              {!address || address != process.env.NEXT_PUBLIC_ADMIN_WALLET ? (
                // If not authenticated, display unauthenticated state
                <div className={styles.create__unauthenticated}>
                  <h2>Access Denied</h2>
                  <p>If you are the site admin, please authenticate</p>
                </div>
              ) : (
                <div className={styles.container}>
                  {/* Edition Name */}
                  <h2>Admin Page</h2>
                  <div className={styles.grid}>
                    {nfts.map((nft, id) => {
                      return <NFTAdmin nft={nft} key={id} />;
                    })}
                  </div>
                </div>
              )}
              </>

      ) : (
        <Loading />
      )}
    </Layout>
  );
}