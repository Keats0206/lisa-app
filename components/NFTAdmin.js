import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import styles from "../styles/components/NFTAdmin.module.scss"; // Component styles
import { web3 } from "../containers/index"; // Web3 container
import ReactPlayer from "react-player";
import { useToasts } from "react-toast-notifications";

export default function NFTAdmin({ nft }) {
  const {
    address,
    activeNetwork,
    getTotalSupply,
    purchaseEdition,
  } = web3.useContainer();
  const [nftSupply, setNFTSupply] = useState(0);
  const [loading, setLoading] = useState(false);
  const [directLink, setDirectLink] = useState(false);
  const [newPrice, setNewPrice] = useState(false);
  const [valueInContract, setValueInContract] = useState(false);
  const { addToast } = useToasts();

  const handlePurchaseWithLoading = async () => {
    setLoading(true);
    const { result, message } = await purchaseEdition(nft.contractAddress);
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
    setLoading(false);
  };

  const setDirectLinkOpenSea = async () => {
    let url = `https://testnets.opensea.io/collection/${nft.contractAddress}`;
    setDirectLink(url);
  };

  const getSupply = async () => {
    let supply = await getTotalSupply(nft.contractAddress);
    setNFTSupply(supply);
  };

  // Move this stuff to server side
  useEffect(() => {
    getSupply();
    setDirectLinkOpenSea();
  }, []);

  const ActionForm = () => {
    return (
      <div>
        <div>
          <label htmlFor="newPrice">
            Price{" "}
            <span className={styles.create__upload_required}>(required)</span>
          </label>
          <input
            id="newPrice"
            type="number"
            placeholder="Enter New Price"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <button>Update Sale Price</button>
        </div>
        <div>
          Amonut in Contract: {valueInContract}
          <button>Withdraw Amount</button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.detail}>
        <h1>{nft.name}</h1>
        <h3>{nft.symbol}</h3>
        <p>{nft.description}</p>
        <div className={styles.sub_details}>
          <div>
            <h4>Price:</h4>
            <h2>0.08 ETH</h2>
          </div>
          <div>
            <h4>Editions Remaining:</h4>
            <h2>
              {nft.editionSize - nftSupply} out of {nft.editionSize}
            </h2>
          </div>
        </div>

        {address ? (
          <>{activeNetwork ? <ActionForm /> : <p>Wrong Network</p>}</>
        ) : (
          <p>Connect Wallet</p>
        )}
        <a>
          {/* <a href={directLink}> */}
          <h4>View Collection on Opensea</h4>
        </a>
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
