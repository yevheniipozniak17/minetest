import Image from 'next/image';
import { Container } from '@/app/_components/Container/Container';
import catSleep from '@/public/store/images/currency-cat-sleep@2x.png';
import styles from './Currency.module.css';

type CurrencyCard = {
  currency: string;
  type: string;
  howToObtain: string;
  whatToSpendOn: string;
};

const HEADER_LABELS = ['Currency', 'Type', 'How to obtain', 'What to spend on'] as const;

const currencies: CurrencyCard[] = [
  {
    currency: 'Crystals',
    type: 'Donation',
    howToObtain: 'In-store purchase',
    whatToSpendOn: 'Rare resources, special items',
  },
  {
    currency: 'Dollars',
    type: 'Gaming',
    howToObtain: 'Earnings in the game',
    whatToSpendOn: 'Trading with players',
  },
];

export default function Currency() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.layout}>
          <div className={styles.content}>
            <h2 className={styles.title}>Currency Info</h2>

            <div className={styles.tableHeader} aria-hidden>
              {HEADER_LABELS.map((label) => (
                <span key={label} className={styles.headerCell}>
                  {label}
                </span>
              ))}
            </div>

            <ul className={styles.list}>
              {currencies.map((card) => (
                <li key={card.currency} className={styles.card}>
                  <dl className={styles.details}>
                    <div className={`${styles.cell} ${styles.cellCurrency}`}>
                      <dt className={styles.label}>Currency</dt>
                      <dd className={`${styles.value} ${styles.accent}`}>{card.currency}</dd>
                    </div>
                    <div className={`${styles.cell} ${styles.cellType}`}>
                      <dt className={styles.label}>Type</dt>
                      <dd className={styles.value}>{card.type}</dd>
                    </div>
                    <div className={`${styles.cell} ${styles.cellObtain}`}>
                      <dt className={styles.label}>How to obtain</dt>
                      <dd className={styles.value}>{card.howToObtain}</dd>
                    </div>
                    <div className={`${styles.cell} ${styles.cellSpend}`}>
                      <dt className={styles.label}>What to spend on</dt>
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
