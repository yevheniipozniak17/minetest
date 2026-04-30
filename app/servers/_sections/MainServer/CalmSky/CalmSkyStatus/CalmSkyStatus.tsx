import styles from './CalmSkyStatus.module.css';

const STATS = [
  { value: '508', labelMobile: 'Players', labelDesktop: 'Players Online' },
  { value: '71%', labelMobile: 'Load', labelDesktop: 'Server Load' },
  { value: '~15ms', labelMobile: 'Ping', labelDesktop: 'Ping' },
];

export default function CalmSkyStatus() {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span className={styles.dot} aria-hidden="true" />
        <h3 className={styles.title}>
          <span className={styles.titleMobile}>Live Status</span>
          <span className={styles.titleDesktop}>Live Server Status</span>
        </h3>
        <span className={styles.online}>ONLINE</span>
      </div>

      <ul className={styles.stats}>
        {STATS.map((stat) => (
          <li key={stat.labelDesktop} className={styles.stat}>
            <p className={styles.value}>{stat.value}</p>
            <p className={styles.label}>
              <span className={styles.labelMobile}>{stat.labelMobile}</span>
              <span className={styles.labelDesktop}>{stat.labelDesktop}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
