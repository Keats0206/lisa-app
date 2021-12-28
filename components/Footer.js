import styles from "../styles/components/Footer.module.scss"; // Component styles
import Image from "next/image"; // Next image

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.mirror_link}>
        <a
          href="https://twitter.com/0xpkeating"
          target="_blank"
          rel="noreferrer"
        >
          Built by Pete Keating
        </a>
      </div>
    </div>
  );
}
