import { useState, useEffect } from "react"; // State management
import NFT from "../components/NFT"; // Post content
import Dropzone from "react-dropzone"; // React dropzone upload
import { useRouter } from "next/router"; // Router
import Layout from "../components/Layout"; // Layout wrapper
import { web3 } from "../containers/index"; // Web3 container
import styles from "../styles/pages/Create.module.scss"; // Page styles
import { editions } from "../data/editions"; // Page styles
import ReactPlayer from "react-player";

export default function Create() {
  const router = useRouter(); // Router navigation
  const [name, setName] = useState(""); // Edition name
  const [symbol, setSymbol] = useState(""); // Edition symbol
  const [animationURL, setAnimationURL] = useState(""); // Media fee share with past owner
  const [editionSize, setEditionSize] = useState(null); // Media fee share with past owner
  const [royaltyBPS, setRoyaltyBPS] = useState(null); // Media fee share with past owner
  const [loading, setLoading] = useState(false); // Global loading state
  const [uploadName, setUploadName] = useState(""); // Uploaded file name
  const [uploadText, setUploadText] = useState(null); // Text content
  const [description, setDescription] = useState(""); // Media description

  const [nft, setNFT] = useState(null); // Media description

  useEffect(() => {
    setNFT(editions[0]);
  }, []);

  // Global state
  const { address, authenticate, mintMedia } = web3.useContainer();

  /**
   * Authenticate dApp with global loading
   */
  const authenticateWithLoading = async () => {
    setLoading(true); // Toggle loading
    await authenticate(); // Authenticate
    setLoading(false); // Toggle loading
  };

  /**
   * Mint media with global loading
   */
  const mintWithLoading = async () => {
    setLoading(true); // Toggle loading

    try {
      await mintMedia(upload, name, description, share); // Mint media
      router.push("/success"); // Redirect to success page
    } catch (e) {
      console.log("Error when executing: ", e);
    }

    setLoading(false); // Toggle loading
  };

  return (
    <Layout>
      {!address ? (
        // If not authenticated, display unauthenticated state
        <div className={styles.create__unauthenticated}>
          <h2>Please authenticate</h2>
          <p>You must authorize with your wallet to mint media.</p>

          {/* Authenticate dApp */}
          <button onClick={authenticateWithLoading} disabled={loading}>
            {loading ? "Connecting..." : "Connect"}
          </button>
        </div>
      ) : (
        // Else, if authenticated, display grid
        <div className={styles.create}>
          <div className={styles.create__grid}>
            {/* Creation form */}
            <div className={styles.create__grid_left}>
              <h2>Create Media</h2>

              <div className={styles.create__upload}>
                <div>
                  {/* Edition name */}
                  <div>
                    <label htmlFor="name">
                      Name{" "}
                      <span className={styles.create__upload_required}>
                        (required)
                      </span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Edition symbol */}
                  <div>
                    <label htmlFor="symbol">
                      Symbol{" "}
                      <span className={styles.create__upload_required}>
                        (required)
                      </span>
                    </label>
                    <input
                      id="symbol"
                      type="text"
                      placeholder="Enter Symbol"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                    />
                  </div>

                  {/* Edition description */}
                  <div>
                    <label htmlFor="description">
                      Description
                      <span className={styles.create__upload_required}>
                        (required)
                      </span>
                    </label>
                    <textarea
                      id="description"
                      type="text"
                      placeholder="Enter Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Edition Media IPFS URL */}
                  <div>
                    <label htmlFor="animationURL">
                      Animation IPFS URL{" "}
                      <span className={styles.create__upload_required}>
                        (required)
                      </span>
                    </label>
                    <span>
                      for example:
                      "https://ipfs.io/ipfs/QmX13sSh8VqmAsgCwdMegj2ZhNQFPUbwifF944gFHhVTr8"
                    </span>
                    <input
                      id="animationURL"
                      type="text"
                      placeholder="Enter Animation IPFS URL"
                      value={animationURL}
                      onChange={(e) => setAnimationURL(e.target.value)}
                    />
                  </div>

                  {/* Edition Size */}
                  <div>
                    <label htmlFor="editionSize">
                      Edition Size{" "}
                      <span className={styles.create__upload_required}>
                        (required)
                      </span>
                    </label>
                    <span>
                      If set to zero, there will be unlimited editions.
                    </span>
                    <input
                      id="editionSize"
                      type="number"
                      placeholder="Enter Edition Size"
                      min="0"
                      max="100"
                      value={editionSize}
                      onChange={(e) => setEditionSize(e.target.value)}
                    />
                  </div>

                  {/* Media fee share percentage */}
                  <div>
                    <label htmlFor="percentage">
                      Creator share percentage{" "}
                      <span className={styles.create__upload_required}>
                        (required)
                      </span>
                    </label>
                    <span>
                      A percentage fee that you receive for all future sales of
                      this piece.
                    </span>
                    <input
                      id="percentage"
                      type="number"
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      value={royaltyBPS}
                      onChange={(e) => setRoyaltyBPS(e.target.value)}
                    />
                    {royaltyBPS > 100 || royaltyBPS < 0 ? (
                      // If share is not 0...100%, show error
                      <span className={styles.create__error}>
                        Percentage fee must be between 0% - 100%.
                      </span>
                    ) : null}
                  </div>
                </div>
                {/* Media mint button */}
                <div>
                  <button
                    onClick={mintWithLoading}
                    disabled={
                      royaltyBPS > 100 || // Fee share above 100%
                      royaltyBPS < 0 || // Fee share below 0%
                      !name || // No name provided
                      !symbol || // No symbol provided
                      !description || // No description provided
                      !animationURL || // No animationURL provided
                      !editionSize || // No editionSize provided
                      !royaltyBPS || // No royaltyBPS provided
                      loading // Global loading state
                    }
                  >
                    {loading ? "Minting..." : "Mint Media"}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview grid section */}
            <div className={styles.create__grid_right}>
              <h2>Preview</h2>
              <div className={styles.create__preview}>
                {/* Display post with dynamic content to preview */}
                <div className={styles.media}>
                  {animationURL ? (
                    <ReactPlayer
                      url={animationURL}
                      controls={true}
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <div className={styles.media_placeholder}></div>
                  )}
                </div>
                <div className={styles.nft_preview_container}>
                  <div className={styles.detail}>
                    <h1>{name || "Name"}</h1>
                    <h3>{symbol || "SMBL"}</h3>
                    <p>{description || "Sample nft description"}</p>
                    <div className={styles.sub_details}>
                      <div>
                        <h4>Edition Price:</h4>
                        <h2>0.08 ETH</h2>
                      </div>
                      <div>
                        <h4>NFTs Sold:</h4>
                        <h2>0 out of {editionSize || 100}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
