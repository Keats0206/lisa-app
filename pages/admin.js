import { useState, useEffect } from "react";
import Layout from "../components/Layout"; // Layout
import Spinner from "../components/Spinner"; // Layout
import { web3 } from "../containers/index"; // Web3 container
import styles from "../styles/pages/Admin.module.scss"; // Component styles
import NFTAdmin from "../components/NFTAdmin";

export default function Admin() {
  const [editions, setEditions] = useState([]);

  const { address, nfts } = web3.useContainer();

  useEffect(() => {
    setEditions(nfts);
  }, [nfts]);

  return (
    <Layout>
      {/* Checking if editions have been fetched to the UI */}
      {editions ? (
        <>
          {/* Check if user is authenticated and is site admin */}
          {address && address == process.env.NEXT_PUBLIC_ADMIN_WALLET ? (
            <div className={styles.container}>
              {/* Edition Name */}
              <h2>Admin Page</h2>
              <div className={styles.grid}>
                {editions.map((edition, id) => {
                  return <NFTAdmin nft={edition} key={id} />;
                })}
              </div>
            </div>
          ) : (
            // Not authentcicated, or not site admin
            <div className={styles.create__unauthenticated}>
              <h2>Access Denied</h2>
              <p>If you are the site admin, please authenticate</p>
            </div>
          )}
        </>
      ) : (
        <div>
          <Spinner />
        </div>
      )}
    </Layout>
  );
}
