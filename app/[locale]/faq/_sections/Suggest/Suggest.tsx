import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './Suggest.module.css';

export default async function Suggest() {
  const t = await getTranslations('faq');

  return (
    <section className={styles.suggest}>
      <Container variant="faq">
        <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.top}>
            <span className={styles.icon} aria-hidden="true">
              💡
            </span>
            <span className={styles.topLabel}>{t('suggest.improvePage')}</span>
          </div>

          <h2 className={styles.title}>{t('suggest.title')}</h2>
          <p className={styles.description}>{t('suggest.desc')}</p>

          <label className={styles.fieldLabel} htmlFor="faq-suggest-question">
            {t('suggest.yourQuestion')}
          </label>
          <input
            id="faq-suggest-question"
            className={styles.input}
            type="text"
            placeholder={t('suggest.placeholder')}
          />

          <label className={styles.fieldLabel} htmlFor="faq-suggest-category">
            {t('suggest.category')}
          </label>
          <button id="faq-suggest-category" type="button" className={styles.select}>
            <span className={styles.selectPlaceholder}>{t('suggest.pickOne')}</span>
            <span className={styles.chevron} aria-hidden="true">
              ▾
            </span>
          </button>

          <button type="button" className={styles.submit}>
            {t('suggest.submit')}
          </button>
        </div>
        </div>
      </Container>
    </section>
  );
}
