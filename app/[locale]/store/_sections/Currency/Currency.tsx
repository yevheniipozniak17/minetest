import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import catSleep from '@/public/store/images/currency-cat-sleep@2x.png';
import styles from './Currency.module.css';

const CURRENCY_KEYS = ['crystals', 'dollars'] as const;

export default async function Currency() {
  const t = await getTranslations('store');

  const headerLabels = [
    t('currency_colCurrency'),
    t('currency_colType'),
    t('currency_colObtain'),
    t('currency_colSpend'),
  ];

  const currencies = CURRENCY_KEYS.map((key) => ({
    id: key,
    currency: t(`currency_${key}_name`),
    type: t(`currency_${key}_type`),
    howToObtain: t(`currency_${key}_obtain`),
    whatToSpendOn: t(`currency_${key}_spend`),
  }));

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.layout}>
          <div className={styles.content}>
            <h2 className={styles.title}>{t('currency_title')}</h2>

            <div className={styles.tableHeader} aria-hidden>
              {headerLabels.map((label) => (
                <span key={label} className={styles.headerCell}>
                  {label}
                </span>
              ))}
            </div>

            <ul className={styles.list}>
              {currencies.map((card) => (
                <li key={card.id} className={styles.card}>
                  <dl className={styles.details}>
                    <div className={`${styles.cell} ${styles.cellCurrency}`}>
                      <dt className={styles.label}>{t('currency_colCurrency')}</dt>
                      <dd className={`${styles.value} ${styles.accent}`}>{card.currency}</dd>
                    </div>
                    <div className={`${styles.cell} ${styles.cellType}`}>
                      <dt className={styles.label}>{t('currency_colType')}</dt>
                      <dd className={styles.value}>{card.type}</dd>
                    </div>
                    <div className={`${styles.cell} ${styles.cellObtain}`}>
                      <dt className={styles.label}>{t('currency_colObtain')}</dt>
                      <dd className={styles.value}>{card.howToObtain}</dd>
                    </div>
                    <div className={`${styles.cell} ${styles.cellSpend}`}>
                      <dt className={styles.label}>{t('currency_colSpend')}</dt>
                      <dd className={styles.value}>{card.whatToSpendOn}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>

          <Image
            className={styles.cat}
            src={catSleep}
            alt=""
            aria-hidden
            sizes="(min-width: 1280px) 386px, 0px"
            priority={false}
          />
        </div>
      </Container>
    </section>
  );
}
