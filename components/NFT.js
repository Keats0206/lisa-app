import { useState, useEffect } from "react"; // React state
import styles from "../styles/components/NFT.module.scss"; // Component styles
import { web3 } from "../containers/index"; // Web3 container
import ReactPlayer from "react-player"; // React video player
import { useToasts } from "react-toast-notifications"; // Pop up notifications
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function NFT({ nft }) {
  const { address, activeNetwork, purchaseEdition } = web3.useContainer();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const [videoURL, setVideoUrl] = useState("twitter.com");
  const [videoReady, setVideoReady] = useState(false);
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

  // Render Video
  const renderVideoPlayer= () => (
    <ReactPlayer
      url={videoURL}
      controls={true}
      width="100%"
      height="100%"
      onError={() => handleVideoError()}
      onReady={() => handleVideoReady()}
    />
  );

  // Handle video ready to play
  const handleVideoReady = () => {
    setVideoReady(true);
  };

  const handleVideoError = () => {
    // On error, set playerURL to null
    setVideoUrl(null);
    // Set url back to nft uri, causes player to reload.
    setVideoUrl(nft.uris[0]);
    // If succesfull, onReady will be called, which will hide skeleton loading and show the video
  };


  useEffect(() => {
    setVideoUrl(nft.uris[0]);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.media_container}>
        {/* Render skeleton for initial state, when videoReady, hide */}
        <Skeleton height="100%" width="100%" style={{display: videoReady ? "none" : "block"}}/>
        {/* Render video in background, when ready, display video */}
        <div style={{display: videoReady ? "block" : "none"}}>{renderVideoPlayer()}</div>
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
