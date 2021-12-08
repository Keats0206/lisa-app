import Link from "next/link"; // Dynamic routing
import Image from "next/image";
import Spinner from "../components/Spinner";
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
        <a href="https://11lit3s.com/">
          <Image src="/logo.png" alt="11 LIT3S Logo" height={75} width={75} />
        </a>
      </div>
      {/* Menu */}
      <div className={styles.header__menu}>
        {address ? (
          <>
            {activeNetwork ? (
              <>
                {address == process.env.NEXT_PUBLIC_ADMIN_WALLET ? (
                  <>
                    <Link href={`/create`}>
                      <a>Create</a>
                    </Link>
                    <Link href={`/admin`}>
                      <a>Admin</a>
                    </Link>
                  </>
                ) : (
                  <></>
                )}
                <button className={styles.header__menu_button_gray}>
                  {address.substr(0, 5) +
                    "..." +
                    address.slice(address.length - 5)}
                </button>
              </>
            ) : (
              <>
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
