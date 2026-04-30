import styles from './LuckyFeatures.module.css';

const FEATURES = [
  {
    icon: '🌿',
    title: 'Survival Gameplay',
    description: 'Classic open-world survival, day/night cycle',
  },
  {
    icon: '⚔️',
    title: 'PvP Battles',
    description: 'Fair combat arenas and open-world PvP zones',
  },
  {
    icon: '💰',
    title: 'In-game Economy',
    description: 'Buy, sell and trade items with other players',
  },
  {
    icon: '🤝',
    title: 'Player Interaction',
    description: 'Guilds, alliances and collaborative building',
  },
];

export default function LuckyFeatures() {
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
              <p className={styles.description}>{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
