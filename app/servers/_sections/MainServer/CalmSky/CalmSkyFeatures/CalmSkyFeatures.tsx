import styles from './CalmSkyFeatures.module.css';

const FEATURES = [
  {
    icon: '🏗️',
    title: 'Creative Building',
    descriptionMobile: 'Unlimited creative mode with WorldEdit',
    descriptionDesktop: 'Unlimited creative mode with premium WorldEdit tools',
  },
  {
    icon: '🌄',
    title: 'Exploration',
    descriptionMobile: 'Vast unexplored worlds and custom biomes',
    descriptionDesktop:
      'Vast unexplored worlds with custom biomes and structures',
  },
  {
    icon: '🎨',
    title: 'Build Contests',
    descriptionMobile: 'Regular community competitions with prizes',
    descriptionDesktop: 'Regular community build competitions with prizes',
  },
  {
    icon: '🤝',
    title: 'Community Plots',
    descriptionMobile: 'Claim your plot and build with neighbors',
    descriptionDesktop: 'Claim your own plot and build with neighbors',
  },
];

export default function CalmSkyFeatures() {
  return (
    <section className={styles.card}>
      <h3 className={styles.eyebrow}>Gameplay Features</h3>
      <ul className={styles.list}>
        {FEATURES.map((feature) => (
          <li key={feature.title} className={styles.feature}>
            <span className={styles.iconWrap} aria-hidden="true">
              <span className={styles.icon}>{feature.icon}</span>
            </span>
            <div className={styles.text}>
              <p className={styles.title}>{feature.title}</p>
              <p className={styles.description}>
                <span className={styles.descMobile}>
                  {feature.descriptionMobile}
                </span>
                <span className={styles.descDesktop}>
                  {feature.descriptionDesktop}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
