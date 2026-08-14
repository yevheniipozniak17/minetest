import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import { SOCIAL_LINKS } from '@/app/_components/Header/navLinks';
import ContactForm from '@/app/[locale]/contacts/_sections/ContactForm/ContactForm';
import { CONTACT_CHANNELS } from '@/lib/data/contacts';
import styles from './ContactChannels.module.css';

export default async function ContactChannels() {
  const t = await getTranslations('marketing');

  return (
    <section className={styles.channels} aria-labelledby="contact-channels-heading">
      <Container variant="faq" className={styles.shell}>
        <header className={styles.intro}>
          <h2 id="contact-channels-heading" className={styles.sectionTitle}>
            {t('contacts.channels.title')}
          </h2>
          <p className={styles.sectionDescription}>{t('contacts.channels.description')}</p>
        </header>

        <div className={styles.body}>
          <ul className={styles.grid}>
            {CONTACT_CHANNELS.map(channel => (
              <li key={channel.id} className={styles.card}>
                <div className={styles.cardIcon} aria-hidden="true">
                  {channel.icon}
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>
                    {t(`contacts.data.channel.${channel.id}.title` as const)}
                  </h3>
                  <p className={styles.cardDescription}>
                    {t(`contacts.data.channel.${channel.id}.description` as const)}
                  </p>
                  {channel.meta ? <p className={styles.cardMeta}>{channel.meta}</p> : null}
                </div>
                <a href={channel.href} className={styles.primaryButton}>
                  {t(`contacts.data.channel.${channel.id}.actionLabel` as const)}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.formColumn}>
            <ContactForm />
          </div>

          <article className={styles.socialCard}>
            <p className={styles.socialLabel}>{t('contacts.channels.followUs')}</p>
            <h3 className={styles.socialTitle}>{t('contacts.channels.socialTitle')}</h3>
            <p className={styles.socialDescription}>{t('contacts.channels.socialDescription')}</p>
            <ul className={styles.socialList}>
              {SOCIAL_LINKS.map(link => (
                <li key={link.alt}>
                  <a
                    href={link.href}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.alt}
                  >
                    <Image
                      src={link.icon}
                      alt=""
                      width={link.size}
                      height={link.size}
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Container>
    </section>
  );
}
