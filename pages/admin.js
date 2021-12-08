import { useState, useEffect } from "react";
import Layout from "../components/Layout"; // Layout
import { web3 } from "../containers/index"; // Web3 container
import styles from "../styles/pages/Admin.module.scss"; // Component styles
import { useToasts } from "react-toast-notifications";
import NFTAdmin from "../components/NFTAdmin";
import { createEdition, fetchEditionsSupabase } from "../data/supabase";

export default function Admin({ editions }) {
  const {
    address,
  } = web3.useContainer();

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
          <h2>Admin Page</h2>
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
