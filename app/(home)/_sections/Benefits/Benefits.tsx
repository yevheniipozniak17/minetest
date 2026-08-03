import { getTranslations } from 'next-intl/server';
import BenefitsList from './BenefitsList/BenefitsList';
import styles from './Benefits.module.css';
import { Divider } from '../../../_components/Divider/Divider';
import { Container } from '../../../_components/Container/Container';

export type BenefitsCardProps = {
  title: string;
  text: string;
};

export default async function BenefitsSection() {
  const t = await getTranslations('home');

  const items: BenefitsCardProps[] = [
    { title: t('benefits.stableServers.title'), text: t('benefits.stableServers.text') },
    { title: t('benefits.regularUpdates.title'), text: t('benefits.regularUpdates.text') },
    { title: t('benefits.livingCommunity.title'), text: t('benefits.livingCommunity.text') },
    { title: t('benefits.fairEconomy.title'), text: t('benefits.fairEconomy.text') },
    { title: t('benefits.activeTeam.title'), text: t('benefits.activeTeam.text') },
    { title: t('benefits.playerSupport.title'), text: t('benefits.playerSupport.text') },
  ];

  return (
    <>
      <section className={styles.benefitsSection}>
        <Container>
          <h2 className={styles.title}>{t('benefits.title')}</h2>
          <BenefitsList items={items} />
        </Container>
        <div className={styles.benefitsVideoContainer}>
          <div className={styles.overlay}></div>
          <video className={styles.video} autoPlay loop muted playsInline preload="none">
            <source src="/video/benefits-video.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
      <Divider />
    </>
  );
}
