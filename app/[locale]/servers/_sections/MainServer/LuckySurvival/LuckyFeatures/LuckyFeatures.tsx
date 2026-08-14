import { useTranslations } from 'next-intl';
import styles from './LuckyFeatures.module.css';

export default function LuckyFeatures() {
  const t = useTranslations('servers');

  const FEATURES = [
    { icon: '🌿', title: t('lucky.feature1Title'), description: t('lucky.feature1Desc') },
    { icon: '⚔️', title: t('lucky.feature2Title'), description: t('lucky.feature2Desc') },
    { icon: '💰', title: t('lucky.feature3Title'), description: t('lucky.feature3Desc') },
    { icon: '🤝', title: t('lucky.feature4Title'), description: t('lucky.feature4Desc') },
  ];

  return (
    <section className={styles.card}>
      <h3 className={styles.eyebrow}>{t('shared.gameplayFeatures')}</h3>
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
