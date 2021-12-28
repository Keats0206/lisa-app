import { useState, useEffect } from "react"; // State management
import { useRouter } from "next/router"; // Router
import Layout from "../components/Layout"; // Layout wrapper
import { web3 } from "../containers/index"; // Web3 container
import styles from "../styles/pages/Create.module.scss"; // Page styles
import { useToasts } from "react-toast-notifications"; // Popup Notifications

// Disclaimer: This page was built only to support the creation of Video based Editions for a specific project.
export default function Create() {
  const router = useRouter(); // Router navigation
  const [name, setName] = useState(""); // Edition name for ETH contract
  const [symbol, setSymbol] = useState(""); // Edition symbol for ETH contract
  const [loading, setLoading] = useState(false); // Global loading state
  const { addToast } = useToasts();
  
  // Global state
  const { address, createCreatorNFTContract } = web3.useContainer();
  /**
   * Mint media with global loading
   */
  const mintWithLoading = async () => {
    setLoading(true); // Toggle loading
    try {
      // Call create funciton
      await createCreatorNFTContract(name, symbol);
      router.push("/"); // Redirect to success page
    } catch (e) {
      console.log("Error when executing: ", e);
    }
    setLoading(false); // Toggle loading
  };

  return (
    <Layout>
        <div className={styles.container}>
            <h2>Create NFT Contract</h2>
            <p>This application allows creators to deploy their own NFT smart contracts onto the Rinkeby blockchain. </p>
            {/* Creation form */}
            <div className={styles.create__grid_left}>
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

                  {/* Edition symbol */}
                  <div>
                    <label htmlFor="type">
                      Contract Type{" "}
                      <span className={styles.create__upload_required}>
                        (more coming soon)
                      </span>
                    </label>
                    <input
                      id="symbol"
                      type="text"
                      placeholder="Enter Symbol"
                      value="ERC721"
                      disabled
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
                      loading // Global loading state
                    }
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </div>
        </div>
    </Layout>
  );
}
