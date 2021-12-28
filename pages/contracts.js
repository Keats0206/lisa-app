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

  const handleRowClick = (contractAdress) => {
      const url = "https://rinkeby.etherscan.io/address/" + contractAdress
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
      if (newWindow) newWindow.opener = null
  }

  useEffect(() => {
    fetchContracts(address);
  }, [address]);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.collections_header}>
          <h2>Your Contracts</h2>
          <div>
            <Link href="/create">
              <a>Create Collection</a>
            </Link>
          </div>
        </div>
        {editions && editions.length > 0 ? (
          <>
            <table className={styles.collections_table}>
              <thead className={styles.collections_table_header}>
                <th>Name</th>
                <th>Symbol</th>
                <th>Token Type</th>
              </thead>
              <tbody>
              {editions.map((edition, i) => {
                  return (
                    <tr 
                      className={styles.collections_row}
                      key={i}
                      onClick={()=>handleRowClick(edition.contractAddress)}
                    > 
                      <td>{edition.name}</td>
                      <td>{edition.symbol}</td>
                      <td>ERC721</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
