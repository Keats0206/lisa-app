import Image from "next/image"; // HTML Head
import Header from "../components/Header"; // Header component
import styles from "../styles/pages/Layout.module.scss"; // Component styles


export default function Layout({ children }, isProfile) {
  return (
    <div>
      <Header />
      <div className={styles.container}>{children}</div>
      <div className={styles.background}>
        <h1>11 LIT3S</h1>
        <h3>Welcome to the 11 LIT3S Hotel NFT drop.</h3>
      </div>
    </div>
  );
}
