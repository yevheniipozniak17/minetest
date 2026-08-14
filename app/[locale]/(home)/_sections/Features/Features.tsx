import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './Features.module.css';

import FeaturesList from './FeaturesList/FeaturesList';
import { Divider } from '@/app/_components/Divider/Divider';

export type FeaturesCardProps = {
  title: string;
  text: string;
  description: string;
  icon: string;
};

export default async function Features() {
  const t = await getTranslations('home');

  const items: FeaturesCardProps[] = [
    {
      title: t('features.buildCreate.title'),
      text: t('features.buildCreate.text'),
      description: t('features.buildCreate.description'),
      icon: '/icons/icons/features-box.svg',
    },
    {
      title: t('features.surviveCompete.title'),
      text: t('features.surviveCompete.text'),
      description: t('features.surviveCompete.description'),
      icon: '/icons/icons/crown.svg',
    },
    {
      title: t('features.skinsCosmetics.title'),
      text: t('features.skinsCosmetics.text'),
      description: t('features.skinsCosmetics.description'),
      icon: '/icons/icons/features-mask.svg',
    },
    {
      title: t('features.inGameEconomy.title'),
      text: t('features.inGameEconomy.text'),
      description: t('features.inGameEconomy.description'),
      icon: '/icons/icons/dollar.svg',
    },
    {
      title: t('features.eventsTournaments.title'),
      text: t('features.eventsTournaments.text'),
      description: t('features.eventsTournaments.description'),
      icon: '/icons/icons/features-calendar.svg',
    },
  ];

  return (
    <>
      <section className={styles.features}>
        <Container>
          <h2 className={styles.title}>{t('features.title')}</h2>
          <FeaturesList items={items} />
        </Container>
      </section>

      <Divider />
    </>
  );
}
