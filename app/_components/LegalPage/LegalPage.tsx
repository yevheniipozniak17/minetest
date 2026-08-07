import { getTranslations } from 'next-intl/server';
import { Badge } from '../Badge/Badge';
import { Container } from '../Container/Container';
import { LEGAL_COMPANY_DETAILS, PRIVACY_EMAIL } from '@/lib/data/contacts';
import styles from './LegalPage.module.css';

type LegalSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocument = {
  badge: string;
  title: string;
  lastUpdated: string;
  intro: string | string[];
  sections: LegalSection[];
};

export async function LegalPage({ document }: { document: LegalDocument }) {
  const t = await getTranslations('legal');
  const { badge, title, lastUpdated, intro, sections } = document;
  const introParagraphs = Array.isArray(intro) ? intro : [intro];

  return (
    <section className={styles.section}>
      <Container className={styles.inner}>
        <header className={styles.header}>
          <Badge>{badge}</Badge>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.updated}>{t('lastUpdatedLabel')}: {lastUpdated}</p>
          <div className={styles.introGroup}>
            {introParagraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex} className={styles.intro}>
                {paragraph}
              </p>
            ))}
          </div>
        </header>

        <div className={styles.companyDetailsWrap}>
          <table className={styles.companyDetailsTable}>
            <tbody>
              <tr>
                <th scope="row" className={styles.companyDetailsLabel}>
                  {t('companyDetails.company')}
                </th>
                <td className={styles.companyDetailsValue}>{LEGAL_COMPANY_DETAILS.name}</td>
              </tr>
              <tr>
                <th scope="row" className={styles.companyDetailsLabel}>
                  {t('companyDetails.companyNo')}
                </th>
                <td className={styles.companyDetailsValue}>{LEGAL_COMPANY_DETAILS.companyNo}</td>
              </tr>
              <tr>
                <th scope="row" className={styles.companyDetailsLabel}>
                  {t('companyDetails.registeredAddress')}
                </th>
                <td className={styles.companyDetailsValue}>
                  {LEGAL_COMPANY_DETAILS.registeredAddress}
                </td>
              </tr>
              <tr>
                <th scope="row" className={styles.companyDetailsLabel}>
                  {t('companyDetails.email')}
                </th>
                <td className={styles.companyDetailsValue}>
                  <a
                    href={`mailto:${LEGAL_COMPANY_DETAILS.email}`}
                    className={styles.companyDetailsLink}
                  >
                    {LEGAL_COMPANY_DETAILS.email}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.body}>
          {sections.map((sectionItem, index) => (
            <section key={sectionItem.heading} className={styles.block}>
              <h2 className={styles.blockHeading}>
                <span className={styles.blockNumber}>{index + 1}.</span>
                {sectionItem.heading}
              </h2>
              {sectionItem.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
              {sectionItem.bullets && sectionItem.bullets.length > 0 ? (
                <ul className={styles.list}>
                  {sectionItem.bullets.map((item, bulletIndex) => (
                    <li key={bulletIndex} className={styles.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <footer className={styles.contactFooter}>
          <p className={styles.contactLabel}>{t('contactFooterLabel')}</p>
          <p className={styles.contactText}>
            {t('contactFooterText')}{' '}
            <a href={`mailto:${PRIVACY_EMAIL}`} className={styles.contactLink}>
              {PRIVACY_EMAIL}
            </a>
          </p>
        </footer>
      </Container>
    </section>
  );
}
