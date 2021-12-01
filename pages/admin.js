import {useState} from "react";
import Layout from "../components/Layout"; // Layout
import { web3 } from "../containers/index"; // Web3 container
import styles from "../styles/pages/Admin.module.scss"; // Component styles

export default function Admin() {
  const { getEditionURIs, purchaseEdition, setSalePrice, createEdition, editionId } = web3.useContainer();
  const [status, setStatus] = useState("");
  const [display, setDisplay] = useState("");

  const handleCreateEdition = async () => {
    const { result, message } = await createEdition();
    setStatus(result);
    setDisplay(message)
  }

  // const setSale = async () => {
  //   const salePrice = await setSalePrice();
  // }

  return (
    <Layout>
      <div className={styles.container}>
      {/* Edition Name */}
      <button onClick={()=>handleCreateEdition()}>Create New Edition Contract</button>
      <div>{status}</div>
      <div>{display}</div>
       <button onClick={()=>setSale()}>Set Sale Price to: 0.08 ETH</button>
      </div>
    </Layout>
  );
}