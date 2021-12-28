import Header from "../components/Header"; // Header component
import styles from "../styles/pages/Layout.module.scss"; // Component styles
import { web3 } from "../containers/index"; // Global state

export default function Layout({ children }) {
  const { address } = web3.useContainer(); // Global state

  return (
    <div>
      {/* Header */}
      <Header />
      {/* Content Container */}
      <div className={styles.container}>
        {address ? (
           <>{children}</>
        ) : (
          <div className={styles.no_auth}>
            Authenticate to use the app
          </div>
        )}
      </div>
    </div>
  );
}
