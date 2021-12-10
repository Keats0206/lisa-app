import styles from "../styles/components/Footer.module.scss"; // Component styles
import Image from "next/image";

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.social_links}>
        <a href="https://twitter.com/11LIT3S" target="_blank"  rel="noreferrer">
          <Image
            src="/twitter.png"
            alt="11 LIT3S Logo"
            height={30}
            width={30}
          />
        </a>
        <a href="https://11LIT3S.com/discord" target="_blank"  rel="noreferrer">
          <Image
            src="/discord.png"
            alt="11 LIT3S Logo"
            height={30}
            width={30}
          />
        </a>
      </div>
      <div className={styles.mirror_link}>
        <a
          href="https://mirror.xyz/11lit3s.eth/Vk-S00xlWzsTTEvEZBfeuCnOm4_0o2SP74hjKKItWbw"
          target="_blank"
          rel="noreferrer"
        >
          Learn more about 11 LIT3S HOTEL.
        </a>
      </div>
    </div>
  );
}
