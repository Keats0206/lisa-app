import { useState, useEffect } from "react"; // React state
import styles from "../styles/components/NFT.module.scss"; // Component styles
import { web3 } from "../containers/index"; // Web3 container
import ReactPlayer from "react-player"; // React video player
import { useToasts } from "react-toast-notifications"; // Pop up notifications

export default function NFT({ nft }) {
  const { address, activeNetwork, purchaseEdition } = web3.useContainer();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const [videoURL, setVideoUrl] = useState("twitter.com");
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

  // When there is an error
  // Then set it back to the original source
  // Render null instead of player
  // Rerender player
  const handleVideoError = () => {
    console.log("Video error")
    console.log("Setting video to null")
    setVideoUrl(null);
    console.log("Resting with URI again to reload")
    setVideoUrl(nft.uris[0]);
  };

  // Render Video
  const renderVideoContainer = () => (
    <div className={styles.media}>
        <ReactPlayer
          url={videoURL}
          controls={true}
          width="100%"
          height="100%"
          onError={() => handleVideoError()}
        />
    </div>
  );

  useEffect(() => {
    setVideoUrl(nft.uris[0]);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.media_container}>
      {renderVideoContainer()}
      </div>
      {/* NFT Detail Container */}
      <div className={styles.detail}>
        <h1>{nft.name}</h1>
        <h3>{nft.symbol}</h3>
        <p>{nft.description}</p>
        <div className={styles.sub_details}>
          <div>
            <h4>PRICE:</h4>
            {nft.salePrice > 0 ? (
              <h2>{nft.salePrice} ETH</h2>
            ) : (
              <h2>Unlisted</h2>
            )}
          </div>
          <div>
            <h4>EDITIONS REMAINING:</h4>
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
                    {loading ? "Purchasing..." : "Purchase Edition"}
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
        <a href={nft.directLink} target="_blank" rel="noopener noreferrer">
          View Collection on Zora
        </a>
      </div>
    </div>
  );
}
