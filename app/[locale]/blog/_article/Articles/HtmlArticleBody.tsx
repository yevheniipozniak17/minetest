'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Container } from '@/app/_components/Container/Container';
import ArticleShareLinks from '@/app/[locale]/blog/_components/ArticleShareLinks/ArticleShareLinks';
import type { TocItem } from '@/app/[locale]/blog/_adapter';
import contentStyles from '@/app/[locale]/blog/_view/ArticleContent.module.css';
import styles from './Articles.module.css';
import { useArticleToc } from './useArticleToc';

type HtmlArticleBodyProps = {
  title: string;
  lead: string;
  sanitizedHtml: string;
  tocItems: TocItem[];
  sidebarTags: readonly string[];
  heroImage: string;
};

export default function HtmlArticleBody({
  title,
  lead,
  sanitizedHtml,
  tocItems,
  sidebarTags,
  heroImage,
}: HtmlArticleBodyProps) {
  const t = useTranslations('blog');
  const sectionIds = tocItems.map(item => item.id);
  const { activeId, readingProgress, setActiveId } = useArticleToc(sectionIds);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={styles.articles}>
      <Container variant="blog">
        <div className={styles.body}>
          <aside className={styles.sidebar}>
            <nav className={styles.card} aria-label={t('sidebar.onThisPage')}>
              <div className={styles.head}>
                <span className={styles.headLabel}>{t('sidebar.onThisPage')}</span>
                <span className={styles.headIcon} aria-hidden="true">
                  ▾
                </span>
              </div>

              <ol className={styles.list}>
                {tocItems.map((item, index) => {
                  const isActive = item.id === activeId;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                        aria-current={isActive ? 'true' : undefined}
                        onClick={() => scrollToSection(item.id)}
                      >
                        <span className={styles.itemNumber}>{index + 1}</span>
                        <span className={styles.itemLabel}>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className={styles.progressBlock}>
                <div className={styles.progressRow}>
                  <span className={styles.progressLabel}>{t('sidebar.readingProgress')}</span>
                  <span className={styles.progressValue}>{readingProgress}%</span>
                </div>

                <div
                  className={styles.progressBar}
                  role="progressbar"
                  aria-valuenow={readingProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={t('sidebar.readingProgress')}
                >
                  <span className={styles.progressFill} style={{ width: `${readingProgress}%` }} />
                </div>
              </div>
            </nav>

            <div className={styles.shareCard}>
              <p className={styles.shareCardTitle}>{t('sidebar.shareTitle')}</p>
              <ArticleShareLinks
                title={title}
                className={styles.shareCardLinks}
                linkClassName={styles.shareLink}
              />
            </div>

            <div className={styles.tagsCard}>
              <p className={styles.tagsCardTitle}>{t('sidebar.tagsTitle')}</p>
              <ul className={styles.tagsList}>
                {sidebarTags.map(tag => (
                  <li key={tag}>
                    <span className={styles.tag}>{tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className={styles.main}>
            <div className={styles.shareRow}>
              <span className={styles.shareLabel}>{t('sidebar.shareLabel')}</span>
              <ArticleShareLinks
                title={title}
                className={styles.shareRowLinks}
                linkClassName={styles.shareLink}
              />
            </div>

            <Image
              src={heroImage}
              alt={title}
              width={760}
              height={411}
              priority
              sizes="(min-width: 1280px) 760px, 100vw"
              className={styles.heroImage}
            />

            <p className={styles.lead}>{lead}</p>

            <div
              className={contentStyles.prose}
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
