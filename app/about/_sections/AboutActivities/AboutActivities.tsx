import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './AboutActivities.module.css';

/** Tone mirrors the matching world in the section artwork. */
const SERVERS = [
  { name: 'LuckySurvival', genreKey: 'card1Genre', tone: 'survival' },
  { name: 'MineWars', genreKey: 'card2Genre', tone: 'pvp' },
  { name: 'CalmSky', genreKey: 'card3Genre', tone: 'calm' },
] as const;

export default async function AboutActivities() {
  const t = await getTranslations('marketing');

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.layout}>
          <div className={styles.visual}>
            <Image
              className={styles.visualImage}
              src="/about/images/tournament-worlds.webp"
              alt=""
              width={1440}
              height={960}
              sizes="(min-width: 1280px) 560px, 335px"
              aria-hidden="true"
            />
          </div>

          <div className={styles.main}>
            <div className={styles.content}>
              <span className={styles.badge}>{t('about.activities.badge')}</span>
              <h2 className={styles.title}>{t('about.activities.title')}</h2>
              <p className={styles.description}>{t('about.activities.description')}</p>

              <ul className={styles.servers}>
                {SERVERS.map(({ name, genreKey, tone }) => (
                  <li key={name} className={styles.server} data-tone={tone}>
                    <span className={styles.serverDot} aria-hidden="true" />
                    <span className={styles.serverName}>{name}</span>
                    <span className={styles.serverGenre}>
                      {t(`about.servers.${genreKey}` as const)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
