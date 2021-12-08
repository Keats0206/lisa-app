import { useState, useEffect } from "react";
import Layout from "../components/Layout"; // Layout
import { web3 } from "../containers/index"; // Web3 container
import styles from "../styles/pages/Admin.module.scss"; // Component styles
import { useToasts } from "react-toast-notifications";
import NFTAdmin from "../components/NFTAdmin";
import { createEdition, fetchEditionsSupabase } from "../data/supabase";

export default function Admin({ editions }) {
  const {
    setSalePrice,
    fetchEditionMetadata,
    getEditionNFTs,
  } = web3.useContainer();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();

  const handleCreateEdition = async () => {
    const { result, message } = await createEdition();
    // Add toast notification
    if (result) {
      addToast(message, {
        appearance: "success",
        autoDismiss: true,
      });
      setStatus(message);
    } else {
      addToast(message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const supabaseCreate = async () => {
    await createEdition();
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

  const getMetadata = async () => {
    await getEditionNFTs();
  };

  return (
    <Layout>
      {!address || address != process.env.NEXT_PUBLIC_ADMIN_WALLET ? (
        // If not authenticated, display unauthenticated state
        <div className={styles.create__unauthenticated}>
          <h2>Access Denied</h2>
          <p>If you are the site admin, please authenticate</p>
        </div>
      ) : (
        <div className={styles.container}>
          {/* Edition Name */}
          <h2>Admin Controls</h2>
          {/* 
        <button
          onClick={() => getMetadata()}
          disabled={loading}
        >
          Get NFTs
        </button>

        <button
          onClick={() => supabaseCreate()}
          disabled={loading}
        >
          Create SupaRecord
        </button>

        <div>{status}</div>
        <h3>Existing NFTs</h3>
        <button onClick={() => setSale()}>Set Sale Price</button> */}

          <div className={styles.grid}>
            {editions.map((edition, id) => {
              return <NFTAdmin nft={edition} key={id} />;
            })}
          </div>
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const editions = await fetchEditionsSupabase();

  return {
    props: { editions: editions },
  };
};
