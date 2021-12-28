import Link from "next/link"; // Dynamic routing
import { useState } from "react"; // State management
import { web3 } from "../containers/index"; // Global state
import styles from "../styles/components/Header.module.scss"; // Component styles

// Header
export default function Header() {
  const [loading, setLoading] = useState(false); // Loading state
  const { address, authenticate, activeNetwork } = web3.useContainer(); // Global state

  const authenticateWithLoading = async () => {
    setLoading(true); // Toggle loading
    await authenticate(); // Authenticate
    setLoading(false); // Toggle loading
  };

  return (
    <div className={styles.header}>
      {/* Logo */}
      <div className={styles.header__logo}>
        <Link href="/">
          <a>Lisa</a>
        </Link>
      </div>
      {/* Menu */}
      <div className={styles.header__menu}>
        {/* Is user authenicated? */}
        {address ? (
          <>
            {/* Is user on the correct network, set in the .env file & web3 container */}
            {activeNetwork ? (
              <>
                {/* Show authenticated address  */}
                <button className={styles.header__menu_button_gray}>
                  {address.substr(0, 5) +
                    "..." +
                    address.slice(address.length - 5)}
                </button>
              </>
            ) : (
              <>
              {/* Show Wrong Network Button */}
                <button
                  className={styles.header__menu_button_red}
                  disabled={true}
                >
                  Wrong Network
                </button>
              </>
            )}
          </>
        ) : (
          // Else if user is not authenticated
          <button
            className={styles.header__menu_button_gray}
            onClick={authenticateWithLoading}
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect"}
          </button>
        )}
      </div>
    </div>
  );
}
