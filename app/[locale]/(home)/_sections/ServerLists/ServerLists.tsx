import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import { Divider } from '@/app/_components/Divider/Divider';
import { SERVER_LISTINGS } from '@/lib/data/serverListings';
import styles from './ServerLists.module.css';

export default async function ServerLists() {
  const t = await getTranslations('home');

  return (
    <>
      <section className={styles.section} aria-labelledby="server-lists-title">
        <Container>
          <h2 id="server-lists-title" className={styles.title}>
            {t('serverLists.title')}
          </h2>
          <p className={styles.description}>{t('serverLists.description')}</p>
          <ul className={styles.grid} aria-label={t('serverLists.listLabel')}>
            {SERVER_LISTINGS.map(item => (
              <li key={item.href}>
                <a
                  className={styles.link}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img className={styles.mark} src={item.logo} alt="" width={32} height={32} />
                  <span className={styles.name}>{item.name}</span>
                  <svg className={styles.chevron} viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      d="M7.5 4.5 13 10l-5.5 5.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <Divider />
    </>
  );
}
