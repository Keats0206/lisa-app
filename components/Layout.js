import Head from "next/head"; // HTML Head
import Header from "../components/Header"; // Header component
import styles from "../styles/pages/Layout.module.scss"; // Component styles

export default function Layout({ children }, isProfile) {
  return (
    <div>
      {/* Header */}
      <Header />
      {/* Content container */}
      <div className={styles.container}>{children}</div>
      <div className={styles.background}>
        <h1>Andy Warhol</h1>
        <h3>Welcome to the Factory. Print bootleg NFTs of Warhol art on the Rinkeby Testnet.</h3>
      </div>
    </div>
  );
}
