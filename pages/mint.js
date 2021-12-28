import { useState, useEffect } from "react"; // State management
import NFT from "../components/NFT"; // Post content
import { useRouter } from "next/router"; // Router
import Layout from "../components/Layout"; // Layout wrapper
import { web3 } from "../containers/index"; // Web3 container
import styles from "../styles/pages/Create.module.scss"; // Page styles
import ReactPlayer from "react-player"; // React player

// Disclaimer: This page was built only to support the creation of Video based Editions for a specific project.
export default function Create() {
  const router = useRouter(); // Router navigation
  const [name, setName] = useState(""); // Edition name for ETH contract
  const [symbol, setSymbol] = useState(""); // Edition symbol for ETH contract
  const [description, setDescription] = useState(""); // NFT description
  const [mediaUrl, setMediaUrl] = useState(""); // Animaiton URL for rich media, IPFS ideally
  const [loading, setLoading] = useState(false); // Global loading state

  // Global state
  const { address, createEdition } = web3.useContainer();

  /**
   * Mint media with global loading
   */
  const mintWithLoading = async () => {
    setLoading(true); // Toggle loading

    try {
      // Call create edition funciton
      await createEdition(
        name,
        symbol,
        description,
        previewImageUrl,
        animationUrl,
        editionSize,
        royaltyBPS
      );
      router.push("/admin"); // Redirect to success page
    } catch (e) {
      console.log("Error when executing: ", e);
    }

    setLoading(false); // Toggle loading
  };

  return (
    <Layout>
      <div className={styles.create}>
        <div className={styles.create__grid}>
          {/* Preview grid section */}
          <div className={styles.create__grid_right}>
            <h2>Preview</h2>
            <div className={styles.create__preview}>
              {/* Display post with dynamic content to preview */}
              <div className={styles.media}>
                {mediaUrl ? (
                  <ReactPlayer
                    url={mediaUrl}
                    controls={true}
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <div className={styles.media_placeholder}>

                  </div>
                )}
              </div>
              <h1>{name || "Sample Name"}</h1>
              <p>$ {symbol || "SYMBL"}</p>
            </div>
          </div>

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
                  <label htmlFor="mediaUrl">
                    Animation IPFS URL{" "}
                    <span className={styles.create__upload_required}>
                      (required)
                    </span>
                  </label>
                  <span>
                    for example:
                    https://ipfs.io/ipfs/QmX13sSh8VqmAsgCwdMegj2ZhNQFPUbwifF944gFHhVTr8
                  </span>
                  <input
                    id="mediaUrl"
                    type="text"
                    placeholder="Enter Media IPFS URL"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                  />
                </div>
              </div>

              {/* Media mint button */}
              <div>
                <button
                  onClick={mintWithLoading}
                  disabled={
                    !name || // No name provided
                    !symbol || // No symbol provided
                    !description || // No description provided
                    !mediaUrl || // No mediaUrl provided
                    loading // Global loading state
                  }
                >
                  {loading ? "Minting..." : "Mint NFT"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
