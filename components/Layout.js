import Header from "../components/Header"; // Header component
import styles from "../styles/pages/Layout.module.scss"; // Component styles

export default function Layout({ children }) {
  return (
    <div>
      {/* Header */}
      <Header />
      {/* Content Container */}
      <div className={styles.container}>{children}</div>
    </div>
  );
}
