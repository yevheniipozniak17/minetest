'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Container } from '@/app/_components/Container/Container';
import ArticleShareLinks from '@/app/[locale]/blog/_components/ArticleShareLinks/ArticleShareLinks';
import styles from './Articles.module.css';
import { useArticleToc } from './useArticleToc';

const SECTION_IDS = ['01', '02', '03', '04', '05', '06', '07', '08'] as const;

function BulletList({
  items,
  desktopItems,
}: {
  items: string[];
  desktopItems?: string[];
}) {
  return (
    <>
      <ul className={`${styles.bulletList} ${desktopItems ? styles.mobileOnly : ''}`}>
        {items.map(item => (
          <li key={item} className={styles.bulletItem}>
            <span className={styles.bullet} aria-hidden="true" />
            <span className={styles.bulletText}>{item}</span>
          </li>
        ))}
      </ul>
      {desktopItems && (
        <ul className={`${styles.bulletList} ${styles.desktopOnly}`}>
          {desktopItems.map(item => (
            <li key={item} className={styles.bulletItem}>
              <span className={styles.bullet} aria-hidden="true" />
              <span className={styles.bulletText}>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function OrderedList({
  items,
  desktopItems,
}: {
  items: string[];
  desktopItems?: string[];
}) {
  return (
    <>
      <ol className={`${styles.orderedList} ${desktopItems ? styles.mobileOnly : ''}`}>
        {items.map((item, index) => (
          <li key={item} className={styles.orderedItem}>
            <span className={styles.orderedNum}>{index + 1}</span>
            <span className={styles.orderedText}>{item}</span>
          </li>
        ))}
      </ol>
      {desktopItems && (
        <ol className={`${styles.orderedList} ${styles.desktopOnly}`}>
          {desktopItems.map((item, index) => (
            <li key={item} className={styles.orderedItem}>
              <span className={styles.orderedNum}>{index + 1}</span>
              <span className={styles.orderedText}>{item}</span>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

function ArticleFigure({
  src,
  alt,
  caption,
  dashed,
}: {
  src: string;
  alt: string;
  caption: string;
  dashed?: boolean;
}) {
  return (
    <figure className={styles.figure}>
      <div
        className={`${styles.figureFrame} ${dashed ? styles.figureFrameDashed : ''}`}
      >
        <Image src={src} alt={alt} width={760} height={420} className={styles.figureImage} />
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

function Callout({
  variant,
  title,
  mobile,
  desktop,
}: {
  variant: 'info' | 'warn';
  title: string;
  mobile: string;
  desktop?: string;
}) {
  return (
    <aside
      className={`${styles.callout} ${variant === 'info' ? styles.calloutInfo : styles.calloutWarn}`}
    >
      <p className={styles.calloutTitle}>{title}</p>
      <p className={`${styles.calloutText} ${desktop ? styles.mobileOnly : ''}`}>{mobile}</p>
      {desktop && (
        <p className={`${styles.calloutText} ${styles.desktopOnly}`}>{desktop}</p>
      )}
    </aside>
  );
}

export default function Articles() {
  const t = useTranslations('blog');

  const tocItems = t.raw('updates.toc') as Array<{ id: string; label: string }>;
  const tags = t.raw('updates.tags') as string[];

  const { activeId, readingProgress, setActiveId } = useArticleToc(SECTION_IDS);

  const scrollToSection = (id: string) => {
    setActiveId(id as (typeof SECTION_IDS)[number]);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const s01 = t.raw('updates.s01') as Record<string, string | string[]>;
  const s02 = t.raw('updates.s02') as Record<string, string | boolean>;
  const s03 = t.raw('updates.s03') as Record<string, string | string[]>;
  const s04 = t.raw('updates.s04') as Record<string, string | string[]>;
  const s05 = t.raw('updates.s05') as Record<string, string | boolean>;
  const s06 = t.raw('updates.s06') as Record<string, string | string[]>;
  const s07 = t.raw('updates.s07') as Record<string, string | string[]>;
  const s08 = t.raw('updates.s08') as Record<string, string>;

  return (
    <section className={styles.articles}>
      <Container variant="blog">
        <div className={styles.body}>
          <aside className={styles.sidebar}>
            <nav className={styles.card} aria-label={t('updates.onThisPage')}>
              <div className={styles.head}>
                <span className={styles.headLabel}>{t('updates.onThisPage')}</span>
                <span className={styles.headIcon} aria-hidden="true">
                  ▾
                </span>
              </div>

              <ol className={styles.list}>
                {tocItems.map(item => {
                  const isActive = item.id === activeId;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                        aria-current={isActive ? 'true' : undefined}
                        onClick={() => scrollToSection(item.id)}
                      >
                        <span className={styles.itemNumber}>{item.id}</span>
                        <span className={styles.itemLabel}>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className={styles.progressBlock}>
                <div className={styles.progressRow}>
                  <span className={styles.progressLabel}>{t('updates.readingProgress')}</span>
                  <span className={styles.progressValue}>{readingProgress}%</span>
                </div>

                <div
                  className={styles.progressBar}
                  role="progressbar"
                  aria-valuenow={readingProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={t('updates.readingProgress')}
                >
                  <span
                    className={styles.progressFill}
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
              </div>
            </nav>

            <div className={styles.shareCard}>
              <p className={styles.shareCardTitle}>{t('updates.shareArticle')}</p>
              <ArticleShareLinks
                title={t('updates.shareTitle')}
                className={styles.shareCardLinks}
                linkClassName={styles.shareLink}
              />
            </div>

            <div className={styles.tagsCard}>
              <p className={styles.tagsCardTitle}>{t('updates.tagsLabel')}</p>
              <ul className={styles.tagsList}>
                {tags.map(tag => (
                  <li key={tag}>
                    <span className={styles.tag}>{tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className={styles.main}>
            <div className={styles.shareRow}>
              <span className={styles.shareLabel}>{t('updates.shareLabel')}</span>
              <ArticleShareLinks
                title={t('updates.shareTitle')}
                className={styles.shareRowLinks}
                linkClassName={styles.shareLink}
              />
            </div>

            <p className={`${styles.lead} ${styles.mobileOnly}`}>{t('updates.leadMobile')}</p>
            <p className={`${styles.lead} ${styles.desktopOnly}`}>{t('updates.leadDesktop')}</p>

            {/* Section 01 */}
            <section id="section-01" className={styles.section}>
              <h2 className={styles.sectionTitle}>{s01.title as string}</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>{s01.paragraphMobile as string}</p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>{s01.paragraphDesktop as string}</p>
              <BulletList
                items={s01.bulletsMobile as string[]}
                desktopItems={s01.bulletsDesktop as string[]}
              />
            </section>

            {/* Section 02 */}
            <section id="section-02" className={styles.section}>
              <h2 className={styles.sectionTitle}>{s02.title as string}</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>{s02.paragraphMobile as string}</p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>{s02.paragraphDesktop as string}</p>
              <ArticleFigure
                src="/blog/update-skyblock.png"
                alt={s02.figureAlt as string}
                caption={s02.figureCaption as string}
                dashed
              />
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>{s02.paragraph2Mobile as string}</p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>{s02.paragraph2Desktop as string}</p>
              <Callout
                variant="info"
                title={s02.calloutTitle as string}
                mobile={s02.calloutMobile as string}
                desktop={s02.calloutDesktop as string}
              />
            </section>

            {/* Section 03 */}
            <section id="section-03" className={styles.section}>
              <h2 className={styles.sectionTitle}>{s03.title as string}</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>{s03.paragraphMobile as string}</p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>{s03.paragraphDesktop as string}</p>
              <h3 className={styles.subheading}>{s03.utilityHeading as string}</h3>
              <OrderedList
                items={s03.utilityCraftsMobile as string[]}
                desktopItems={s03.utilityCraftsDesktop as string[]}
              />
              <h3 className={styles.subheading}>{s03.cosmeticHeading as string}</h3>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>{s03.cosmeticMobile as string}</p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>{s03.cosmeticDesktop as string}</p>
            </section>

            {/* Section 04 */}
            <section id="section-04" className={styles.section}>
              <h2 className={styles.sectionTitle}>{s04.title as string}</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>{s04.paragraphMobile as string}</p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>{s04.paragraphDesktop as string}</p>
              <blockquote className={styles.quote}>
                <p className={`${styles.quoteText} ${styles.mobileOnly}`}>{s04.quoteMobile as string}</p>
                <p className={`${styles.quoteText} ${styles.desktopOnly}`}>{s04.quoteDesktop as string}</p>
                <cite className={styles.quoteAuthor}>— {s04.quoteAuthor as string}</cite>
              </blockquote>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>{s04.tldrDesktop as string}</p>
              <BulletList
                items={s04.bulletsMobile as string[]}
                desktopItems={s04.bulletsDesktop as string[]}
              />
            </section>

            {/* Section 05 */}
            <section id="section-05" className={styles.section}>
              <h2 className={styles.sectionTitle}>{s05.title as string}</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>{s05.paragraphMobile as string}</p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>{s05.paragraphDesktop as string}</p>
              <ArticleFigure
                src="/blog/update-tournament.png"
                alt={s05.figureAlt as string}
                caption={s05.figureCaption as string}
              />
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>{s05.paragraph2Mobile as string}</p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>{s05.paragraph2Desktop as string}</p>
            </section>

            {/* Section 06 */}
            <section id="section-06" className={styles.section}>
              <h2 className={styles.sectionTitle}>{s06.title as string}</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>{s06.paragraphMobile as string}</p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>{s06.paragraphDesktop as string}</p>
              <OrderedList
                items={s06.stepsMobile as string[]}
                desktopItems={s06.stepsDesktop as string[]}
              />
              <Callout
                variant="warn"
                title={s06.calloutTitle as string}
                mobile={s06.calloutMobile as string}
                desktop={s06.calloutDesktop as string}
              />
            </section>

            {/* Section 07 */}
            <section id="section-07" className={styles.section}>
              <h2 className={styles.sectionTitle}>{s07.title as string}</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>{s07.paragraphMobile as string}</p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>{s07.paragraphDesktop as string}</p>
              <BulletList
                items={s07.issuesMobile as string[]}
                desktopItems={s07.issuesDesktop as string[]}
              />
            </section>

            {/* Section 08 */}
            <section id="section-08" className={styles.section}>
              <h2 className={styles.sectionTitle}>{s08.title}</h2>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>{s08.paragraphMobile}</p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>{s08.paragraphDesktop}</p>
              <p className={`${styles.paragraph} ${styles.mobileOnly}`}>{s08.closingMobile}</p>
              <p className={`${styles.paragraph} ${styles.desktopOnly}`}>{s08.closingDesktop}</p>
              <div className={styles.cta}>
                <Link href="/blog" className={styles.ctaPrimary}>
                  {t('articleCta')}
                </Link>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}
