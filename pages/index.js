import Layout from "../components/Layout"; // Layout
import { web3 } from "../containers/index"; // Web3 container
import NFT from "../components/NFT";
import Upcoming from "../components/Upcoming";
import styles from "../styles/pages/Home.module.scss"; // Component styles
import { fetchEditionsSupabase } from "../data/supabase";

export default function Home({ editions }) {
  const { createEdition } = web3.useContainer();

  return (
    <Layout>
      <div className={styles.spacer}></div>
      <div className={styles.blur}>
        {editions.map((edition, id) => {
          // Check if NFT is for sale before filtering
          return <NFT key={id} nft={edition} />;
        })}
        <Upcoming />
      </div>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const editions = await fetchEditionsSupabase();

  return {
    props: { editions: editions },
  };
};
