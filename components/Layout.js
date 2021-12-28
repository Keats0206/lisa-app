import Navigation from "../components/Navigation"; // Header component
import styles from "../styles/pages/Layout.module.scss"; // Component styles
import { web3 } from "../containers/index"; // Global state

export default function Layout({ children }) {
  const { address } = web3.useContainer(); // Global state

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <div className={styles.navigation}>
        <Navigation />
      </div>
      {/* Content Container */}
      <div className={styles.content}>
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
