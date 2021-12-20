import Link from "next/link"; // Dynamic routing
import Image from "next/image"; // Next image
import Spinner from "../components/Spinner"; // Loading state spinner for button
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
          <Image src="/logo.png" alt="11 LIT3S Logo" height={60} width={60} />
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
                {/* Is user the admin */}
                {address == process.env.NEXT_PUBLIC_ADMIN_WALLET ? (
                  <>
                    <Link href={`/create`}>
                      <a className={styles.header__menu_button_black}>Create</a>
                    </Link>
                    <Link href={`/admin`}>
                      <a className={styles.header__menu_button_black}>Admin</a>
                    </Link>
                  </>
                ) : (
                  <></>
                )}
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
            {loading ? <Spinner /> : "Connect"}
          </button>
        )}
      </div>
    </div>
  );
}
