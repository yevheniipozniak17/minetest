import styles from './LuckyStatus.module.css';

const STATS = [
  { value: '427', labelMobile: 'Players', labelDesktop: 'Players Online' },
  { value: '89%', labelMobile: 'Load', labelDesktop: 'Server Load' },
  { value: '~12ms', labelMobile: 'Ping', labelDesktop: 'Ping' },
];

const ACTIVITY_PERCENT = 68;

export default function LuckyStatus() {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span className={styles.dot} aria-hidden="true" />
        <h3 className={styles.title}>Live Server Status</h3>
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

      <div
        className={styles.activityBar}
        role="progressbar"
        aria-valuenow={ACTIVITY_PERCENT}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Server activity"
      >
        <span className={styles.activityFill} />
      </div>
    </section>
  );
}
