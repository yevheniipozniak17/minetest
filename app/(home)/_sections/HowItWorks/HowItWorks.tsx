import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import { Divider } from '@/app/_components/Divider/Divider';
import StepCard from './StepCard/StepCard';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    key: 'chooseServer',
    icon: '/home/images/how-it-works-server.webp',
    isArtwork: true,
  },
  {
    key: 'selectProduct',
    icon: '/home/images/how-it-works-cart.webp',
    isArtwork: true,
  },
  {
    key: 'securePayment',
    icon: '/home/images/how-it-works-shield.webp',
    isArtwork: true,
  },
  {
    key: 'receiveInstantly',
    icon: '/home/images/how-it-works-chest.webp',
    isArtwork: true,
  },
  {
    key: 'enjoyGame',
    icon: '/home/images/how-it-works-sword.webp',
    isArtwork: true,
  },
] as const;

const PERKS = [
  { key: 'instantDelivery', icon: '/icons/how-it-works/bolt.svg' },
  { key: 'securePayments', icon: '/icons/how-it-works/shield.svg' },
] as const;

export default async function HowItWorks() {
  const t = await getTranslations('home');

  return (
    <>
      <section className={styles.section}>
        <Container>
          <h2 className={styles.title}>
            {t.rich('howItWorks.title', {
              accent: chunks => <span className={styles.titleAccent}>{chunks}</span>,
            })}
          </h2>
          <p className={styles.description}>{t('howItWorks.description')}</p>

          <ol className={styles.steps}>
            {STEPS.map(({ key, icon, isArtwork }, index) => (
              <StepCard
                key={key}
                number={String(index + 1).padStart(2, '0')}
                icon={icon}
                isArtwork={isArtwork}
                title={t(`howItWorks.${key}.title` as const)}
                text={t(`howItWorks.${key}.text` as const)}
              />
            ))}
          </ol>

          <div className={styles.summary}>
            <span className={styles.summaryIcon}>
              <Image
                src="/icons/how-it-works/shield.svg"
                alt=""
                width={28}
                height={28}
                aria-hidden="true"
              />
            </span>

            <div className={styles.summaryCopy}>
              <p className={styles.summaryTitle}>{t('howItWorks.summaryTitle')}</p>
              <p className={styles.summaryText}>
                {t.rich('howItWorks.summaryText', {
                  link: chunks => (
                    <Link href="/contacts" className={styles.summaryLink}>
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>

            <ul className={styles.perks}>
              {PERKS.map(({ key, icon }) => (
                <li key={key} className={styles.perk}>
                  <Image src={icon} alt="" width={18} height={18} aria-hidden="true" />
                  {t(`howItWorks.${key}` as const)}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
      <Divider />
    </>
  );
}
