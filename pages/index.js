import Layout from "../components/Layout"; // Layout
import { web3 } from "../containers/index"; // Web3 container
import NFT from "../components/NFT";
import Upcoming from "../components/Upcoming";
import {editions} from "../data/editions";

export default function Home() {
  const { createEdition } = web3.useContainer();

  return (
    <Layout>
      {editions.map((nft) => {
          return(
              <NFT nft={nft}/>
          )
      })}
      <Upcoming />
    </Layout>
  );
}