import styles from './LuckyHowToStart.module.css';

const STEPS = [
  'Install Minecraft Java/Bedrock Edition',
  'Register on our website',
  'Connect to the server IP',
  'Start playing & exploring!',
];

export default function LuckyHowToStart() {
  return (
    <section className={styles.card}>
      <h3 className={styles.title}>How to Start Playing</h3>

      <ol className={styles.steps}>
        {STEPS.map((step) => (
          <li key={step} className={styles.step}>
            <span className={styles.bullet} aria-hidden="true" />
            <span className={styles.stepText}>{step}</span>
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
