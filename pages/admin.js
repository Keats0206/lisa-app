import Layout from "../components/Layout"; // Layout
import { web3 } from "../containers/index"; // Web3 container

export default function Admin() {
  const { getEditionURIs, purchaseEdition, setSalePrice, createEdition, editionId } = web3.useContainer();

  const handleCreateFactory = async () => {
    const editionId = await createEdition();
  }

  const getURIs = async () => {
    const uris = await getEditionURIs();
  }

  const setSale = async () => {
    const salePrice = await setSalePrice();
  }

  return (
    <Layout>
      <div>
       <button onClick={()=>handleCreateFactory()}>Create New Edition Factory Contract</button>
       <p>Edition ID: {editionId}</p>
       <button onClick={()=>setSale()}>Set Sale Price to: 0.08 ETH</button>
      </div>
      <div>
        <h3>Edition ID{editionId}</h3>
        <button onClick={()=>handlePurchase()}>Purchase Edition</button>
      </div>
      <div>
        <h3>Edition ID{editionId}</h3>
        <button onClick={()=>getURIs()}>Get Edition URI</button>
      </div>
    </Layout>
  );
}