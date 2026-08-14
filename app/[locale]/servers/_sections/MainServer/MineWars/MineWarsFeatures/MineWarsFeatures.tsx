import { useTranslations } from 'next-intl';
import styles from './MineWarsFeatures.module.css';

export default function MineWarsFeatures() {
  const t = useTranslations('servers');

  const FEATURES = [
    {
      icon: '⚔️',
      title: t('minewars.feature1Title'),
      descriptionMobile: t('minewars.feature1DescMobile'),
      descriptionDesktop: t('minewars.feature1DescDesktop'),
    },
    {
      icon: '🏆',
      title: t('minewars.feature2Title'),
      descriptionMobile: t('minewars.feature2DescMobile'),
      descriptionDesktop: t('minewars.feature2DescDesktop'),
    },
    {
      icon: '🎖️',
      title: t('minewars.feature3Title'),
      descriptionMobile: t('minewars.feature3DescMobile'),
      descriptionDesktop: t('minewars.feature3DescDesktop'),
    },
    {
      icon: '👥',
      title: t('minewars.feature4Title'),
      descriptionMobile: t('minewars.feature4DescMobile'),
      descriptionDesktop: t('minewars.feature4DescDesktop'),
    },
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
