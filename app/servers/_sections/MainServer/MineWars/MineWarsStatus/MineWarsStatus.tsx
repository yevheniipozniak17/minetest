import styles from './MineWarsStatus.module.css';

const STATS = [
  { value: '312', labelMobile: 'Players', labelDesktop: 'Players Online' },
  { value: '94%', labelMobile: 'Load', labelDesktop: 'Server Load' },
  { value: '~8ms', labelMobile: 'Ping', labelDesktop: 'Ping' },
];

export default function MineWarsStatus() {
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
