import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import styles from "../styles/components/NFT.module.scss"; // Component styles
import { web3 } from "../containers/index"; // Web3 container
import ReactPlayer from "react-player";
import { useToasts } from "react-toast-notifications";

export default function NFT({ nft }) {
  const {
    address,
    activeNetwork,
    getTotalSupply,
    purchaseEdition,
    getSalePrice,
  } = web3.useContainer();
  const [supply, setSupply] = useState(0);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [directLink, setDirectLink] = useState(false);
  const { addToast } = useToasts();

  const handlePurchaseWithLoading = async () => {
    setLoading(true);
    const { result, message } = await purchaseEdition(
      nft.contractAddress,
      price
    );
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

  const handleGetPrice = async () => {
    let res = await getSalePrice(nft.contractAddress);
    setPrice(res);
  };

  const handleGetSupply = async () => {
    let res = await getTotalSupply(nft.contractAddress);
    setSupply(res);
  };

  // Move this stuff to server side
  useEffect(() => {
    handleGetSupply();
    handleGetPrice();
    setDirectLinkOpenSea();
  }, []);

  return (
    <div className={styles.container}>
      {/* NFT Detail Container */}
      <div className={styles.detail}>
        <h1>{nft.name}</h1>
        <h3>{nft.symbol}</h3>
        <p>{nft.description}</p>
        <div className={styles.sub_details}>
          <div>
            <h4>Price:</h4>
            {price > 0 ? (
               <h2>{price} ETH</h2>
            ) : (
              <h2>Unlisted</h2>
            )}
          </div>
          <div>
            <h4>Editions Remaining:</h4>
            <h2>
              {nft.editionSize - supply} out of {nft.editionSize}
            </h2>
          </div>
        </div>
        {/* Check if NFT has been listed for sale */}
        {price > 0 ? (
          <>
            {address ? (
              <>
                {activeNetwork ? (
                  <button
                    onClick={() => handlePurchaseWithLoading()}
                    disabled={loading}
                  >
                    {loading ? <Spinner /> : "Purchase Edition"}
                  </button>
                ) : (
                  <button className={styles.nft__button_noauth} disabled={true}>
                    Wrong Network
                  </button>
                )}
              </>
            ) : (
              <button className={styles.nft__button_noauth} disabled={true}>
                Connect Wallet
              </button>
            )}
          </>
        ) : (
          <>
            {/* Show not for sale button */}
            <button className={styles.nft__button_unlisted} disabled={true}>
              Not For Sale
            </button>
          </>
        )}
        <a>
          {/* <a href={directLink}> */}
          {/* <h4>View Collection on Opensea</h4> */}
        </a>
      </div>
      <div className={styles.media_container}>
        <div className={styles.media}>
          {/* <Parallax y={[-40, 40]}> */}
          <ReactPlayer
            url={nft.animationUrl}
            controls={true}
            width="100%"
            height="100%"
          />
        </div>

        {/* </Parallax> */}
      </div>
    </div>
  );
}
