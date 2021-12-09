import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import styles from "../styles/components/NFTAdmin.module.scss"; // Component styles
import { web3 } from "../containers/index"; // Web3 container
import ReactPlayer from "react-player";
import { useToasts } from "react-toast-notifications";

export default function NFTAdmin({ nft }) {
  const {
    getTotalSupply,
    getContractBalance,
    getSalePrice,
    setSalePrice,
    withdrawEditionBalance
  } = web3.useContainer();

  const [loading, setLoading] = useState(false); // Loading state
  // const [directLink, setDirectLink] = useState(false);
  const [newPrice, setNewPrice] = useState(0); // Price for changed / set NFT edition Price
  const [valueInContract, setValueInContract] = useState(""); // Eth amount available to Admin
  const { addToast } = useToasts();

  // Creating toast alerts on success
  const createToastAlert = async (result, message) => {
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
  }

  const handleSetChangePrice = async () => {
    const { result, message } = await setSalePrice(nft.contractAddress, newPrice);
    createToastAlert(result, message);
    setNewPrice(0);
  };

  const handleGetContractBalance= async () => {
    let eth = await getContractBalance(nft.contractAddress);
    setValueInContract(eth);
  };

  const handleWithdrawETH= async () => {
    setLoading(true);
    const { result, message } = await withdrawEditionBalance(nft.contractAddress);
    createToastAlert(result, message);
    setLoading(false);
  };

  // Move this stuff to server side
  useEffect(() => {
    handleGetContractBalance();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.detail}>
        <h1>{nft.name}</h1>
        <h3>{nft.symbol}</h3>
        <p>{nft.description}</p>
        <div className={styles.sub_details}>
          <div>
            <h4>Price:</h4>
            <h2>{nft.salePrice} ETH</h2>
          </div>
          <div>
            <h4>Editions Remaining:</h4>
            <h2>
              {nft.editionSize - nft.totalSupply} out of {nft.editionSize}
            </h2>
          </div>
        </div>
        <div>
          <div className={styles.action_form}>
            <div>
              <h4>Set or change sale price:</h4>
              <label htmlFor="newPrice">
                Price{" "}
                <span className={styles.create__upload_required}>(ETH)</span>
              </label>
              <input
                id="newPrice"
                type="number"
                step="0.01"
                placeholder="Enter New Price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
              <button 
              onClick={() => handleSetChangePrice()}
              disabled={
                newPrice < 0 || //New price is set to a negative number or 0
                !newPrice // No New Price provided
              }
              >
                {loading ? <Spinner /> : "Update Sale Price"}
              </button>
            </div>
            <div>
              <h4>Withdraw from contract:</h4>
              <h3>
                Amount Available: {valueInContract} ETH
              </h3>
              <span className={styles.create__upload_required}>Only the contract owner can withdraw these funds</span>
              <button 
                onClick={() => handleWithdrawETH()}
              >
                {loading ? <Spinner /> : "Withdraw ETH"}
              </button>
            </div>
            <button 
                onClick={() => handleGetMetadata()}
              >
                {loading ? <Spinner /> : "Get Metadata"}
              </button>
              
          </div>

        </div>
      </div>
      <div className={styles.media}>
        {/* <Parallax y={[-40, 40]}> */}
        <ReactPlayer
          url={nft.uris[0]}
          controls={true}
          width="100%"
          height="100%"
        />
        {/* </Parallax> */}
      </div>
    </div>
  );
}
