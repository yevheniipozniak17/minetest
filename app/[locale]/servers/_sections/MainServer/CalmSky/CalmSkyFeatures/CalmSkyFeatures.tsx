import { useTranslations } from 'next-intl';
import styles from './CalmSkyFeatures.module.css';

export default function CalmSkyFeatures() {
  const t = useTranslations('servers');

  const FEATURES = [
    {
      icon: '🏗️',
      title: t('calmsky.feature1Title'),
      descriptionMobile: t('calmsky.feature1DescMobile'),
      descriptionDesktop: t('calmsky.feature1DescDesktop'),
    },
    {
      icon: '🌄',
      title: t('calmsky.feature2Title'),
      descriptionMobile: t('calmsky.feature2DescMobile'),
      descriptionDesktop: t('calmsky.feature2DescDesktop'),
    },
    {
      icon: '🎨',
      title: t('calmsky.feature3Title'),
      descriptionMobile: t('calmsky.feature3DescMobile'),
      descriptionDesktop: t('calmsky.feature3DescDesktop'),
    },
    {
      icon: '🤝',
      title: t('calmsky.feature4Title'),
      descriptionMobile: t('calmsky.feature4DescMobile'),
      descriptionDesktop: t('calmsky.feature4DescDesktop'),
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
