import styles from './MineWarsFeatures.module.css';

const FEATURES = [
  {
    icon: '⚔️',
    title: 'PvP Combat',
    descriptionMobile: 'Intense player vs player battles in arenas',
    descriptionDesktop: 'Intense player vs player battles in dedicated arenas',
  },
  {
    icon: '🏆',
    title: 'Tournaments',
    descriptionMobile: 'Weekly & seasonal tournaments with prizes',
    descriptionDesktop:
      'Weekly and seasonal competitive tournaments with prizes',
  },
  {
    icon: '🎖️',
    title: 'Ranked Ladder',
    descriptionMobile: 'Climb competitive ladder, earn rewards',
    descriptionDesktop: 'Climb the competitive ladder and earn exclusive rewards',
  },
  {
    icon: '👥',
    title: 'Team Warfare',
    descriptionMobile: 'Faction-based combat and territory control',
    descriptionDesktop: 'Faction-based team combat and territory control',
  },
];

export default function MineWarsFeatures() {
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
