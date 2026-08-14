'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Container } from '@/app/_components/Container/Container';
import styles from './error.module.css';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  const t = useTranslations('system');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.section}>
      <Container variant="faq">
        <div className={styles.content}>
          <span className={styles.badge}>
            <span />
            {t('error_badge')}
          </span>

          <h1 className={styles.title}>{t('error_title')}</h1>
          <p className={styles.text}>{t('error_text')}</p>

          {error?.message ? <p className={styles.details}>{error.message}</p> : null}

          <div className={styles.actions}>
            <button type="button" onClick={reset} className={styles.button}>
              <span>↻</span>{t('error_tryAgain')}
            </button>
            <Link href="/" className={styles.backLink}>
              <span>←</span>{t('error_goBack')}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
