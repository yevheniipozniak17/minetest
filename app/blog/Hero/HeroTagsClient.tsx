'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { categoryHref, parseCategoryParam } from '../categories';
import styles from './HeroTags.module.css';

type HeroTagsClientProps = {
  categories: { slug: string; name: string }[];
};

const INITIAL_VISIBLE_COUNT = 8;

export default function HeroTagsClient({ categories }: HeroTagsClientProps) {
  const searchParams = useSearchParams();
  const activeSlug = parseCategoryParam(searchParams.get('category'));
  const t = useTranslations('blog');

  const visibleTags = categories.slice(0, INITIAL_VISIBLE_COUNT);
  const hiddenTags = categories.slice(INITIAL_VISIBLE_COUNT);
  const hasOverflow = hiddenTags.length > 0;

  const activeInTail = useMemo(
    () =>
      hasOverflow &&
      !!activeSlug &&
      hiddenTags.some(c => c.slug === activeSlug),
    [activeSlug, hiddenTags, hasOverflow]
  );

  // Стартуємо зі згорнутого, щоб SSR і hydration збіглися.
  // Після монтування синхронізуємо з URL: якщо активна категорія у «хвості»
  // — авторозгортаємо, щоб юзер бачив свій вибір.
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (activeInTail) setExpanded(true);
  }, [activeInTail]);

  const showAll = expanded || activeInTail;

  const renderChip = (category: { slug: string; name: string }) => {
    const isActive = category.slug === activeSlug;
    return (
      <Link
        key={category.slug}
        href={categoryHref(category.slug)}
        role="tab"
        aria-selected={isActive}
        className={`${styles.tag} ${isActive ? styles.tagActive : ''}`}
      >
        {category.name}
      </Link>
    );
  };

  return (
    <div
      className={`${styles.tags} ${showAll ? styles.tagsExpanded : ''}`}
      role="tablist"
      aria-label={t('hero.categoriesLabel')}
    >
      <Link
        href={categoryHref()}
        role="tab"
        aria-selected={!activeSlug}
        className={`${styles.tag} ${!activeSlug ? styles.tagActive : ''}`}
      >
        {t('categories.All' as Parameters<typeof t>[0])}
      </Link>

      {visibleTags.map(renderChip)}

      {hasOverflow && !showAll && (
        <button
          type="button"
          className={`${styles.tag} ${styles.tagToggle}`}
          onClick={() => setExpanded(true)}
          aria-expanded={false}
          aria-controls="hero-tags-more"
        >
          +{hiddenTags.length} more
        </button>
      )}

      {hasOverflow && showAll && !activeInTail && (
        <button
          type="button"
          className={`${styles.tag} ${styles.tagToggle}`}
          onClick={() => setExpanded(false)}
          aria-expanded={true}
          aria-controls="hero-tags-more"
        >
          Show less
        </button>
      )}

      {/* Прихована частина: окремий контейнер із max-height/opacity-переходом,
          що плавно з'їзджає з-під основного ряду.
          Теги залишаються в DOM (для SEO), просто overflow: hidden відрізає. */}
      {hasOverflow && (
        <div
          id="hero-tags-more"
          className={`${styles.moreRow} ${showAll ? styles.moreRowOpen : ''}`}
          aria-hidden={!showAll}
        >
          {hiddenTags.map(renderChip)}
        </div>
      )}
    </div>
  );
}
