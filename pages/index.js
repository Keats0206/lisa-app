import Layout from "../components/Layout"; // Layout
import { web3 } from "../containers/index"; // Web3 container
import NFT from "../components/NFT";
import Upcoming from "../components/Upcoming";
import {editions} from "../data/editions";
import styles from "../styles/pages/Home.module.scss"; // Component styles

export default function Home() {
  const { createEdition } = web3.useContainer();

  return (
    <Layout>
      <div className={styles.spacer}></div>
      <div className={styles.blur}>
      {editions.map((nft, id) => {
          return(
              <NFT 
                key={id}
                nft={nft}
              />
          )
      })}
      <Upcoming />
      </div>
    </Layout>
  );
}