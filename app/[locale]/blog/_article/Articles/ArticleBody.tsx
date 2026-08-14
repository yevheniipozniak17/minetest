'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Container } from '@/app/_components/Container/Container';
import ArticleShareLinks from '@/app/[locale]/blog/_components/ArticleShareLinks/ArticleShareLinks';
import type { ArticleBlock, ArticleSection, BlogPostFull, ResponsiveText } from '../types';
import styles from './Articles.module.css';
import { useArticleToc } from './useArticleToc';

function ResponsiveParagraph({ text, className }: { text: ResponsiveText; className: string }) {
  return (
    <>
      <p className={`${className} ${text.desktop ? styles.mobileOnly : ''}`}>{text.mobile}</p>
      {text.desktop && <p className={`${className} ${styles.desktopOnly}`}>{text.desktop}</p>}
    </>
  );
}

function BulletList({
  items,
  desktopItems,
}: {
  items: readonly string[];
  desktopItems?: readonly string[];
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
  items: readonly string[];
  desktopItems?: readonly string[];
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
      <div className={`${styles.figureFrame} ${dashed ? styles.figureFrameDashed : ''}`}>
        <Image src={src} alt={alt} width={760} height={420} className={styles.figureImage} />
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

function Callout({
  variant,
  title,
  text,
}: {
  variant: 'info' | 'warn';
  title: string;
  text: ResponsiveText;
}) {
  return (
    <aside
      className={`${styles.callout} ${variant === 'info' ? styles.calloutInfo : styles.calloutWarn}`}
    >
      <p className={styles.calloutTitle}>{title}</p>
      <p className={`${styles.calloutText} ${text.desktop ? styles.mobileOnly : ''}`}>
        {text.mobile}
      </p>
      {text.desktop && (
        <p className={`${styles.calloutText} ${styles.desktopOnly}`}>{text.desktop}</p>
      )}
    </aside>
  );
}

function ArticleBlockRenderer({ block }: { block: ArticleBlock }) {
  const t = useTranslations('blog');

  switch (block.type) {
    case 'paragraph':
      return <ResponsiveParagraph text={block.text} className={styles.paragraph} />;
    case 'bullets':
      return <BulletList items={block.items} desktopItems={block.desktopItems} />;
    case 'ordered':
      return <OrderedList items={block.items} desktopItems={block.desktopItems} />;
    case 'subheading':
      return <h3 className={styles.subheading}>{block.text}</h3>;
    case 'figure':
      return (
        <ArticleFigure
          src={block.src}
          alt={block.alt}
          caption={block.caption}
          dashed={block.dashed}
        />
      );
    case 'callout':
      return <Callout variant={block.variant} title={block.title} text={block.text} />;
    case 'quote':
      return (
        <blockquote className={styles.quote}>
          <ResponsiveParagraph text={block.text} className={styles.quoteText} />
          <cite className={styles.quoteAuthor}>— {block.author}</cite>
        </blockquote>
      );
    case 'cta':
      return (
        <div className={styles.cta}>
          <Link href="/blog" className={styles.ctaPrimary}>
            {t('articleCta')}
          </Link>
        </div>
      );
    default:
      return null;
  }
}

function ArticleSectionRenderer({
  section,
  index,
}: {
  section: ArticleSection;
  index: number;
}) {
  return (
    <section id={`section-${section.id}`} className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {index + 1}. {section.title}
      </h2>
      {section.blocks.map((block, blockIndex) => (
        <ArticleBlockRenderer key={`${section.id}-${blockIndex}`} block={block} />
      ))}
    </section>
  );
}

type ArticleBodyProps = Pick<BlogPostFull, 'title' | 'lead' | 'sections' | 'sidebarTags'>;

export default function ArticleBody({ title, lead, sections, sidebarTags }: ArticleBodyProps) {
  const t = useTranslations('blog');
  const tocItems = sections.map(section => ({ id: section.id, label: section.tocLabel }));
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

            <ResponsiveParagraph text={lead} className={styles.lead} />

            {sections.map((section, index) => (
              <ArticleSectionRenderer key={section.id} section={section} index={index} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
