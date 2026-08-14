'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Container } from '@/app/_components/Container/Container';
import ArticleShareLinks from '@/app/[locale]/blog/_components/ArticleShareLinks/ArticleShareLinks';
import { getFaqArticleBySlug } from '@/app/[locale]/faq/_data/faqArticles';
import { getTranslatedFaqArticleContent } from '@/app/[locale]/faq/_data/faqArticleContentI18n';
import type { FaqArticleContentBlock, FaqSectionContent } from '@/app/[locale]/faq/_data/faqArticleTypes';
import { GAME_SERVERS } from '@/lib/server/gameServers';
import { TWITCH_URL } from '@/lib/data/social';
import styles from './ArticleBody.module.css';
import { useFaqArticleToc } from './useFaqArticleToc';

const EXAMPLE_IP = GAME_SERVERS.luckysurvival.ip;

/** Renders `**bold**` spans; everything else passes through as plain text. */
function renderRichText(text: string) {
  if (!text.includes('**')) {
    return text;
  }

  return text
    .split('**')
    .map((part, index) => (index % 2 === 1 ? <strong key={index}>{part}</strong> : part));
}

function TextBlock({ text, className }: { text: FaqArticleContentBlock; className: string }) {
  return (
    <>
      <p className={`${className} ${text.desktop ? styles.mobileOnly : ''}`}>
        {renderRichText(text.mobile)}
      </p>
      {text.desktop && (
        <p className={`${className} ${styles.desktopOnly}`}>{renderRichText(text.desktop)}</p>
      )}
    </>
  );
}

/** Callout copy may hold several lines separated by `\n`; each becomes its own paragraph. */
function CalloutText({ text, className }: { text: string; className: string }) {
  return (
    <>
      {text.split('\n').map(line => (
        <p key={line} className={className}>
          {renderRichText(line)}
        </p>
      ))}
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
            <span>{renderRichText(item)}</span>
          </li>
        ))}
      </ul>
      {desktopItems && (
        <ul className={`${styles.bulletList} ${styles.desktopOnly}`}>
          {desktopItems.map(item => (
            <li key={item} className={styles.bulletItem}>
              <span className={styles.bullet} aria-hidden="true" />
              <span>{renderRichText(item)}</span>
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
            <span>{renderRichText(item)}</span>
          </li>
        ))}
      </ol>
      {desktopItems && (
        <ol className={`${styles.orderedList} ${styles.desktopOnly}`}>
          {desktopItems.map((item, index) => (
            <li key={item} className={styles.orderedItem}>
              <span className={styles.orderedNum}>{index + 1}</span>
              <span>{renderRichText(item)}</span>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

function InfoCallout({
  title,
  text,
  desktopText,
}: {
  title: string;
  text: string;
  desktopText?: string;
}) {
  return (
    <aside className={styles.calloutInfo}>
      <p className={styles.calloutTitle}>{title}</p>
      <CalloutText
        text={text}
        className={`${styles.calloutText} ${desktopText ? styles.mobileOnly : ''}`}
      />
      {desktopText && (
        <CalloutText text={desktopText} className={`${styles.calloutText} ${styles.desktopOnly}`} />
      )}
    </aside>
  );
}

function SuccessCallout({
  title,
  desktopTitle,
  text,
  desktopText,
}: {
  title: string;
  desktopTitle?: string;
  text: string;
  desktopText?: string;
}) {
  return (
    <aside className={styles.calloutSuccess}>
      <p className={styles.calloutSuccessTitle}>
        <span aria-hidden="true">✓</span>
        <span className={styles.mobileOnly}>{title}</span>
        {desktopTitle && <span className={styles.desktopOnly}>{desktopTitle}</span>}
      </p>
      <CalloutText
        text={text}
        className={`${styles.calloutText} ${desktopText ? styles.mobileOnly : ''}`}
      />
      {desktopText && (
        <CalloutText text={desktopText} className={`${styles.calloutText} ${styles.desktopOnly}`} />
      )}
    </aside>
  );
}

function SectionRenderer({ section }: { section: FaqSectionContent }) {
  const callout = section.callout;
  const calloutNode = callout ? (
    callout.variant === 'success' ? (
      <SuccessCallout
        title={callout.title}
        desktopTitle={callout.titleDesktop}
        text={callout.text.mobile}
        desktopText={callout.text.desktop}
      />
    ) : (
      <InfoCallout
        title={callout.title}
        text={callout.text.mobile}
        desktopText={callout.text.desktop}
      />
    )
  ) : null;

  return (
    <section id={`section-${section.id}`} className={styles.section}>
      {section.titleDesktop ? (
        <>
          <h2 className={`${styles.sectionTitle} ${styles.mobileOnly}`}>{section.title}</h2>
          <h2 className={`${styles.sectionTitle} ${styles.desktopOnly}`}>{section.titleDesktop}</h2>
        </>
      ) : (
        <h2 className={styles.sectionTitle}>{section.title}</h2>
      )}

      <TextBlock text={section.lead} className={styles.sectionLead} />

      {section.bullets && (
        <BulletList items={section.bullets.mobile} desktopItems={section.bullets.desktop} />
      )}

      {section.bulletsAfterCallout && (
        <>
          {calloutNode}
          <BulletList
            items={section.bulletsAfterCallout.mobile}
            desktopItems={section.bulletsAfterCallout.desktop}
          />
        </>
      )}

      {section.steps && (
        <OrderedList items={section.steps.mobile} desktopItems={section.steps.desktop} />
      )}

      {section.figure && (
        <figure
          className={`${styles.figure} ${section.figure.desktopOnly ? styles.desktopOnly : ''}`}
        >
          <div className={styles.figureFrame}>
            <Image
              src={section.figure.src}
              alt={section.figure.alt}
              width={760}
              height={400}
              className={styles.figureImage}
            />
          </div>
          {section.figure.caption && (
            <figcaption className={`${styles.figureCaption} ${styles.desktopOnly}`}>
              {section.figure.caption}
            </figcaption>
          )}
        </figure>
      )}

      {section.showIpBox && (
        <div className={styles.ipBox}>
          <div className={styles.ipMain}>
            <p className={styles.ipLabel}>Example IP</p>
            <p className={styles.ipValue}>{EXAMPLE_IP}</p>
          </div>
          <button
            type="button"
            className={styles.copyButton}
            onClick={() => void navigator.clipboard.writeText(EXAMPLE_IP)}
          >
            Copy
          </button>
        </div>
      )}

      {!section.bulletsAfterCallout && calloutNode}

      {section.troubleItems && (
        <>
          <ul className={`${styles.troubleList} ${styles.mobileOnly}`}>
            {section.troubleItems.mobile.map(item => (
              <li key={item.title} className={styles.troubleItem}>
                <div className={styles.troubleHead}>
                  <span className={styles.troubleIcon} aria-hidden="true">
                    ⚠
                  </span>
                  <p className={styles.troubleTitle}>{item.title}</p>
                </div>
                <p className={styles.troubleText}>{item.text}</p>
              </li>
            ))}
          </ul>
          <ul className={`${styles.troubleList} ${styles.desktopOnly}`}>
            {section.troubleItems.desktop.map(item => (
              <li key={item.title} className={styles.troubleItem}>
                <div className={styles.troubleHead}>
                  <span className={styles.troubleIcon} aria-hidden="true">
                    ⚠
                  </span>
                  <p className={styles.troubleTitle}>{item.title}</p>
                </div>
                <p className={styles.troubleText}>{item.text}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

type ArticleBodyProps = {
  slug: string;
};

export default function ArticleBody({ slug }: ArticleBodyProps) {
  const t = useTranslations('faq');
  const content = getTranslatedFaqArticleContent(slug, t, t.raw, t.has);
  const meta = getFaqArticleBySlug(slug);

  if (!content || !meta) {
    return null;
  }

  const sectionIds = content.sections.map(section => section.id);
  const { activeId, scrollToSection } = useFaqArticleToc(sectionIds);
  const shareTitle = t(`articles.${slug}.question` as Parameters<typeof t>[0]);
  const primaryCtaHref =
    content.cta?.primary === t('join.ctaPrimary')
      ? TWITCH_URL
      : (content.cta?.primaryHref ?? '/faq');

  return (
    <section className={styles.article}>
      <Container variant="faq">
        <div className={styles.body}>
          <aside className={styles.sidebar}>
            <nav className={styles.sidebarToc} aria-label={t('article.onThisPage')}>
              <p className={styles.sidebarTocLabel}>{t('article.onThisPage')}</p>
              <ul className={styles.sidebarTocList}>
                {content.sections.map(item => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`${styles.sidebarTocItem} ${activeId === item.id ? styles.sidebarTocItemActive : ''}`}
                      onClick={() => scrollToSection(item.id)}
                    >
                      <span className={styles.sidebarTocNum}>{item.tocNum}</span>
                      <span className={styles.sidebarTocText}>{item.tocLabel}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.shareCard}>
              <p className={styles.shareCardTitle}>{t('article.share')}</p>
              <ArticleShareLinks
                title={shareTitle}
                className={styles.shareCardLinks}
                linkClassName={styles.shareLink}
              />
            </div>
          </aside>

          <div className={styles.main}>
            <nav
              className={`${styles.toc} ${styles.mobileOnly}`}
              aria-label={t('article.onThisPage')}
            >
              <div className={styles.tocHead}>
                <span className={styles.tocLabel}>{t('article.onThisPage')}</span>
                <span className={styles.tocChevron} aria-hidden="true">
                  ▾
                </span>
              </div>
              <ul className={styles.tocList}>
                {content.sections.map(item => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`${styles.tocItem} ${activeId === item.id ? styles.tocItemActive : ''}`}
                      onClick={() => scrollToSection(item.id)}
                    >
                      <span className={styles.tocNum}>{item.tocNum}</span>
                      <span className={styles.tocText}>{item.tocLabel}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <TextBlock text={content.lead} className={styles.lead} />

            {content.sections.map(section => (
              <SectionRenderer key={section.id} section={section} />
            ))}

            {content.cta && (
              <div className={styles.ctaGroup}>
                <a
                  href={primaryCtaHref}
                  target={primaryCtaHref.startsWith('http') ? '_blank' : undefined}
                  rel={primaryCtaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={styles.ctaPrimary}
                >
                  {content.cta.primary}
                </a>
                <Link href={content.cta.secondaryHref} className={styles.ctaSecondary}>
                  <span className={styles.mobileOnly}>
                    {content.cta.secondary}{' '}
                    <span className={styles.ctaArrow} aria-hidden="true">
                      →
                    </span>
                  </span>
                  <span className={styles.desktopOnly}>{content.cta.secondary}</span>
                  <span className={`${styles.ctaArrow} ${styles.desktopOnly}`} aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
