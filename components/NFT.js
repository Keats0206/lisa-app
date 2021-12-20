import { useState, useEffect } from "react"; // React state
import Spinner from "../components/Spinner"; // Spinner component
import styles from "../styles/components/NFT.module.scss"; // Component styles
import { web3 } from "../containers/index"; // Web3 container
import ReactPlayer from "react-player"; // React video player
import { useToasts } from "react-toast-notifications"; // Pop up notifications

export default function NFT({ nft }) {
  const { address, activeNetwork, purchaseEdition } = web3.useContainer();
  const [loading, setLoading] = useState(false);

  // To Do: Build link to OpenSea into the UI
  const [directLink, setDirectLink] = useState(false);
  const { addToast } = useToasts();

  /**
   * Handle purchase of an NFT with loading state
   */
  const handlePurchaseWithLoading = async () => {
    setLoading(true);
    const { result, message } = await purchaseEdition(
      nft.contractAddress,
      nft.salePrice
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

  /**
   * Set include opensea URL - could move to NFT creation in web-three state
   */
  const setDirectLinkOpenSea = async () => {
    let url = `https://testnets.opensea.io/collection/${nft.contractAddress}`;
    setDirectLink(url);
  };

  useEffect(() => {
    setDirectLinkOpenSea();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.media_container}>
        <div className={styles.media}>
          <ReactPlayer
            url={nft.uris[0]}
            controls={true}
            width="100%"
            height="100%"
          />
        </div>
      </div>
      {/* NFT Detail Container */}
      <div className={styles.detail}>
        <h1>{nft.name}</h1>
        <h3>{nft.symbol}</h3>
        <p>{nft.description}</p>
        <div className={styles.sub_details}>
          <div>
            <h4>Price:</h4>
            {nft.salePrice > 0 ? (
              <h2>{nft.salePrice} ETH</h2>
            ) : (
              <h2>Unlisted</h2>
            )}
          </div>
          <div>
            <h4>Editions Remaining:</h4>
            <h2>
              {nft.editionSize - nft.totalSupply} out of {nft.editionSize}
            </h2>
          </div>
        </div>
        {/* Check if NFT has been listed for sale */}
        {nft.salePrice > 0 ? (
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
        {/* <a> */}
        {/* <a href={directLink}> */}
        {/* <h4>View Collection on Opensea</h4> */}
        {/* </a> */}
      </div>
    </div>
  );
}
