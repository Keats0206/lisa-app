import { useState, useEffect } from "react"; // React state
import Layout from "../components/Layout"; // Layout
import styles from "../styles/pages/Home.module.scss"; // Home styling
import { web3 } from "../containers/index"; // Web3 container
import { useRouter } from "next/router"; // Router

export default function Home() {
  const [editions, setEditions] = useState(null); // NFT state
  const { address, fetchCreatorContracts } = web3.useContainer(); // Use NFTs from global state
  const router = useRouter(); // Router navigation

  useEffect(() => {
    router.push("/contracts"); // Redirect to success page
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Lisa Studio</h1>
      </div>
    </Layout>
  );
}
