import { useState, useEffect } from "react"; // React state
import Spinner from "../components/Spinner"; // Loading spinner
import styles from "../styles/components/NFTAdmin.module.scss"; // Component styles
import { web3 } from "../containers/index"; // Web3 container
import ReactPlayer from "react-player"; // Video player
import { useToasts } from "react-toast-notifications"; // Popup Notifications

export default function NFTAdmin({ nft }) {
  const {
    getContractBalance,
    setSalePrice,
    withdrawEditionBalance,
    getContractRoyaltyInfo,
  } = web3.useContainer();

  const [loading, setLoading] = useState(false); // Loading state
  // const [directLink, setDirectLink] = useState(false); // To Do: Build link to OpenSea
  const [newPrice, setNewPrice] = useState(0); // Price for changed / set NFT edition Price
  const [valueInContract, setValueInContract] = useState(""); // Eth amount available to Admin
  const { addToast } = useToasts();
  const [royaltyReciever, setRoyaltyReciever] = useState(""); // Price for changed / set NFT edition Price
  const [royaltyAmount, setRoyaltyAmount] = useState(""); // Price for changed / set NFT edition Price

  /**
   * Create popup notification
   */
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
  };

  /**
   * Handle set price change of NFT using newPrice state
   */
  const handleSetChangePrice = async () => {
    const { result, message } = await setSalePrice(
      nft.contractAddress,
      newPrice
    );
    createToastAlert(result, message);
    setNewPrice(0);
  };

  /**
   * Handle get balance of ETH currently available in contract
  */
  const handleGetContractBalance = async () => {
    let eth = await getContractBalance(nft.contractAddress);
    setValueInContract(eth);
  };

   /**
   * Handle get royalty info on NFT
   */
  const getRoyaltyInfo = async () => {
    let { receiver, amount } = await getContractRoyaltyInfo(
      nft.contractAddress,
      nft.salePrice
    );
    setRoyaltyReciever(receiver);
    setRoyaltyAmount(amount);
  };

  /**
   * Handle withdraw ETH from contract. Only owner.
   */
  const handleWithdrawETH = async () => {
    setLoading(true);
    const { result, message } = await withdrawEditionBalance(
      nft.contractAddress
    );
    createToastAlert(result, message);
    setLoading(false);
  };

  /**
   * Handle purchase of an NFT with loading state
   */
  useEffect(() => {
    handleGetContractBalance();
    getRoyaltyInfo();
  }, []);

  return (
    <div className={styles.container}>
      {/* NFT Detail Container */}
      <div className={styles.detail}>
        <h4>{nft.name}</h4>
        <h5>{nft.symbol}</h5>
        <p>{nft.description}</p>
        <div className={styles.sub_details}>
          <div>
            <h5>Price:</h5>
            <h4>{nft.salePrice} ETH</h4>
          </div>
          {/* Remaining Editions Logic */}
          <div>
            <h5>Editions Remaining:</h5>
            <h4>
              {nft.editionSize - nft.totalSupply} out of {nft.editionSize}
            </h4>
          </div>
          <div>
            <h5>Royalty Info:</h5>
            <h4>
              Pay To:{" "}
              {royaltyReciever.substr(0, 5) +
                "..." +
                royaltyReciever.slice(royaltyReciever.length - 5)}
            </h4>
            <h4>Royalty: {royaltyAmount}%</h4>
          </div>
        </div>
        {/* NFT Admin Actions */}
        <div>
          <div className={styles.action_form}>

            {/* Set for sale, or change price */}
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

            {/* Withdraw ETH crom contract */}
            <div>
              <h4>Withdraw from contract:</h4>
              <h3>Amount Available: {valueInContract} ETH</h3>
              <span className={styles.create__upload_required}>
                Only the contract owner can withdraw these funds
              </span>
              <button onClick={() => handleWithdrawETH()}>
                {loading ? <Spinner /> : "Withdraw ETH"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.media}>
        <ReactPlayer
          url={nft.uris[0]}
          controls={true}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}
