import { useState, useEffect } from "react";
import Layout from "../components/Layout"; // Layout
import { web3 } from "../containers/index"; // Web3 container
import styles from "../styles/pages/Admin.module.scss"; // Component styles
import { editions } from "../data/editions";
import { useToasts } from "react-toast-notifications";
import NFTAdmin from "../components/NFTAdmin";

export default function Admin() {
  const {
    setSalePrice,
    createEdition,
  } = web3.useContainer();
  const [status, setStatus] = useState("");
  const [nfts, setNFTs] = useState([]);
  const { addToast } = useToasts();

  const handleCreateEdition = async () => {
    const { result, message } = await createEdition();
    // Add toast notification
    if (result) {
      addToast(message, {
        appearance: "success",
        autoDismiss: true,
      });
      setStatus(message)
    } else {
      addToast(message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const setSale = async () => {
    const { result, message } = await setSalePrice();
    if (result) {
      addToast(message, {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast(message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  useEffect(() => {
    setNFTs(editions);
  })

  return (
    <Layout>
      <div className={styles.container}>
        {/* Edition Name */}
        <h2>Admin Controls</h2>
        <h3>Create new edition</h3>
        <button onClick={() => handleCreateEdition()}>
          Create New Edition Contract
        </button>
        <div>{status}</div>
        <h3>Existing NFT's</h3>
        <button onClick={() => setSale()}>Set Sale Price</button>
        {nfts.map((nft, id) => {
          return (
            // NFT Admin View Component
            <NFTAdmin nft={nft} key={id} />
          );
        })}
      </div>
    </Layout>
  );
}
