import { getTranslations } from 'next-intl/server';
import { Badge } from '@/app/_components/Badge/Badge';
import AuthAwareLink from '@/app/_components/AuthAwareLink/AuthAwareLink';
import { Container } from '@/app/_components/Container/Container';
import styles from './Hero.module.css';

export default async function Hero({ isAuthed = false }: { isAuthed?: boolean }) {
  const t = await getTranslations('marketing');

  return (
    <section className={styles.hero}>
      <Container className={styles.content}>
        <Badge>{t('about.hero.badge')}</Badge>
        <h1 className={styles.title}>{t('about.hero.title')}</h1>
        <p className={styles.description}>{t('about.hero.description')}</p>

        <div className={styles.buttons}>
          <AuthAwareLink isAuthed={isAuthed} intent="play" className={styles.btnPrimary}>
            {t('about.hero.startPlaying')}
          </AuthAwareLink>
          <AuthAwareLink isAuthed={isAuthed} intent="store" className={styles.btnSecondary}>
            {t('about.hero.goToStore')}
          </AuthAwareLink>
        </div>
      </Container>
    </section>
  );
}
