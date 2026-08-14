import { getTranslations } from 'next-intl/server';
import styles from './AboutServers.module.css';
import { Container } from '@/app/_components/Container/Container';
import CardList from './CardList/CardList';

export default async function AboutServers() {
  const t = await getTranslations('marketing');

  return (
    <Container>
      <main className={styles.section}>
        <span className={styles.badge}>{t('about.servers.badge')}</span>
        <h2 className={styles.title}>{t('about.servers.title')}</h2>
        <p className={styles.description}>{t('about.servers.description')}</p>
        <CardList />
      </main>
    </Container>
  );
}
