import styles from './CalmSkyHowToStart.module.css';

const STEPS = [
  {
    mobile: 'Install Minecraft',
    desktop: 'Install Minecraft Java/Bedrock Edition',
  },
  {
    mobile: 'Register on our website',
    desktop: 'Register on our website',
  },
  {
    mobile: 'Connect to CalmSky server',
    desktop: 'Connect to CalmSky server',
  },
  {
    mobile: 'Claim your plot & start building!',
    desktop: 'Claim your plot & start building!',
  },
];

export default function CalmSkyHowToStart() {
  return (
    <section className={styles.card}>
      <h3 className={styles.title}>How to Start Playing</h3>

      <ol className={styles.steps}>
        {STEPS.map((step) => (
          <li key={step.desktop} className={styles.step}>
            <span className={styles.bullet} aria-hidden="true" />
            <span className={styles.stepText}>
              <span className={styles.stepMobile}>{step.mobile}</span>
              <span className={styles.stepDesktop}>{step.desktop}</span>
            </span>
          </li>
        ))}
      </ol>

      <button type="button" className={styles.cta}>
        <span aria-hidden="true">📖</span>
        View Full Instructions →
      </button>
    </section>
  );
}
