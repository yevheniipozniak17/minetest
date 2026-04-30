import Image from 'next/image';
import styles from './LuckyActions.module.css';

export default function LuckyActions() {
  return (
    <section className={styles.card}>
      <h3 className={styles.eyebrow}>Quick Actions</h3>

      <button type="button" className={`${styles.button} ${styles.primary}`}>
        Play Now
      </button>

      <button type="button" className={`${styles.button} ${styles.secondary}`}>
        <Image
          src="/icons/social/ic_outline-discord.svg"
          alt=""
          width={24}
          height={24}
          className={styles.discordIcon}
        />
        Join Discord
      </button>
    </section>
  );
}
