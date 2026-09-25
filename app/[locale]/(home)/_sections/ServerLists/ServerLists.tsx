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
                  <img
                    className={[
                      styles.mark,
                      item.label ? styles.markCompact : '',
                      item.small ? styles.markSmall : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    src={item.logo}
                    alt={item.label ? '' : item.name}
                    width={item.label ? 32 : 220}
                    height={item.label ? 32 : 40}
                  />
                  {item.label ? <span className={styles.name}>{item.name}</span> : null}
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
