import { useState, useEffect } from "react"; // React state
import Layout from "../components/Layout"; // Layout
import Link from "next/link"; // Next image support
import Footer from "../components/Footer"; // Footer component
import styles from "../styles/pages/Contracts.module.scss"; // Home styling
import { web3 } from "../containers/index"; // Web3 container

export default function Contracts() {
  const [editions, setEditions] = useState(null); // NFT state
  const { address, fetchCreatorContracts } = web3.useContainer(); // Use NFTs from global state

  const fetchContracts = async (addr) => {
    try {
      const data = await fetchCreatorContracts(addr);
      setEditions(data);
    } catch (e) {
      console.log("Error when executing: ", e);
    }
  };

  useEffect(() => {
    fetchContracts(address);
  }, [address]);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.collections_header}>
          <h1>Your Contracts</h1>
          <div>
            <Link href="/create">
              <a>Create Collection</a>
            </Link>
          </div>
        </div>
        <div className={styles.collections_table}>
          <div className={styles.collections_table_header}>
            <p>Name</p>
            <p>Symbol</p>
            <p>Token Type</p>
            <p>Etherscan</p>
          </div>
        </div>
        {editions && editions.length > 0 ? (
          <>
            {editions.map((edition, i) => {
              return (
                <div 
                  className={styles.collections_row}
                  key={i}
                > 
                  <p>{edition.name}</p>
                  <p>{edition.symbol}</p>
                  <p>ERC721</p>
                  <a>
                    Etherscan
                  </a>
                </div>
              );
            })}
          </>
        ) : (
          <div className={styles.collections_no_date}>
            No editions, try creating one
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
}
