import styles from './MineWarsHowToStart.module.css';

const STEPS = [
  {
    mobile: 'Install Minecraft',
    desktop: 'Install Minecraft Java/Bedrock Edition',
  },
  {
    mobile: 'Register & verify account',
    desktop: 'Register & verify your account',
  },
  {
    mobile: 'Select MineWars & connect',
    desktop: 'Select MineWars server & connect',
  },
  {
    mobile: 'Join a match or ranked queue!',
    desktop: 'Join a match or ranked queue!',
  },
];

export default function MineWarsHowToStart() {
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
