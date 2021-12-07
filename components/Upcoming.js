import styles from "../styles/components/Upcoming.module.scss"; // Component styles
import Image from 'next/image'

export default function Upcoming() {
  return (
    <div className={styles.container}>
      <div className={styles.social_links}>
        <a href="https://twitter.com/11LIT3S" target="_blank">
          <Image src="/discord.png" alt="11 LIT3S Logo" height={30} width={30} />
        </a>
        <a href="https://11LIT3S.com/discord" target="_blank">
          <Image src="/twitter.png" alt="11 LIT3S Logo" height={30} width={30} />
        </a>
      </div>
    </div>
  );
}
