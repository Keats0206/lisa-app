import Image from "next/image"; // HTML Head
import Header from "../components/Header"; // Header component
import styles from "../styles/pages/Layout.module.scss"; // Component styles
import Upcoming from "./Upcoming";

export default function Layout({ children }, isProfile) {
  return (
    <div>
      <Header />
      <div className={styles.container}>{children}</div>
    </div>
  );
}
