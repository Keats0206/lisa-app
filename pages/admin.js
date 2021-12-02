import { useState } from "react";
import Layout from "../components/Layout"; // Layout
import { web3 } from "../containers/index"; // Web3 container
import styles from "../styles/pages/Admin.module.scss"; // Component styles
import { editions } from "../data/editions";
import ReactPlayer from "react-player";

export default function Admin() {
  const {
    getEditionURIs,
    purchaseEdition,
    setSalePrice,
    createEdition,
    editionId,
  } = web3.useContainer();
  const [status, setStatus] = useState("");
  const [display, setDisplay] = useState("");

  const handleCreateEdition = async () => {
    const { result, message } = await createEdition();
    setStatus(result);
    setDisplay(message);
  };

  const setSale = async () => {
    const salePrice = await setSalePrice();
  };

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
        <div>{display}</div>
        <h3>Existing NFT's</h3>



        
        {/* {editions.map((nft, id) => {
          return (
            <div>
              <ReactPlayer
                url={nft.animationUrl}
                controls={true}
                width="400px"
              />
              <h4>{nft.name}</h4>
              <form>
                <label>
                  Price:
                  <input type="text" name="name" />
                </label>
                <input type="submit" value="Set Sale Price" />
              </form>
            </div>
          );
        })} */}
      </div>
    </Layout>
  );
}
