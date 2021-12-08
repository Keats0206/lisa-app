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
  } = web3.useContainer();

  const [supply, setSupply] = useState("0.00");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [directLink, setDirectLink] = useState(false);
  const [newPrice, setNewPrice] = useState(0);
  const [valueInContract, setValueInContract] = useState("");
  const { addToast } = useToasts();

  const handleSetChangePrice = async () => {
    const { result, message } = await setSalePrice(nft.contractAddress, newPrice);
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
    setNewPrice(0)
  };

  const handleGetContractBalance= async () => {
    let eth = await getContractBalance(nft.contractAddress);
    setValueInContract(eth);
  };

  const handleGetPrice = async () => {
    let res = await getSalePrice(nft.contractAddress);
    setPrice(res);
  };

  const getSupply = async () => {
    let res = await getTotalSupply(nft.contractAddress);
    setSupply(res);
  };

  // Move this stuff to server side
  useEffect(() => {
    getSupply();
    handleGetPrice();
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
            <h2>{price} ETH</h2>
          </div>
          <div>
            <h4>Editions Remaining:</h4>
            <h2>
              {nft.editionSize - supply} out of {nft.editionSize}
            </h2>
          </div>
        </div>
        <div>
          <div className={styles.action_form}>
            <div>
              <h4>Set or Change Sale Price</h4>
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
                Update Sale Price
              </button>
            </div>
            <div>
              <h4>With draw from contract</h4>
              <h3>
                Amount Available: {valueInContract} ETH
              </h3>
              <span className={styles.create__upload_required}>Only the contract owner can withdraw these funds</span>
              <button 
              onClick={() => handleGetContractBalance()}
              // onClick={() => handleWithdrawETH()}
              >
                Withdraw ETH
              </button>
            </div>
          </div>
          {/* <div>
          Amonut in Contract: {valueInContract}
          <button>Withdraw Amount</button>
        </div> */}
        </div>
      </div>
      <div className={styles.media}>
        {/* <Parallax y={[-40, 40]}> */}
        <ReactPlayer
          url={nft.animationUrl}
          controls={true}
          width="100%"
          height="100%"
        />
        {/* </Parallax> */}
      </div>
    </div>
  );
}
