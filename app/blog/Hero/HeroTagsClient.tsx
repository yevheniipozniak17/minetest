'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { categoryHref, parseCategoryParam } from '../categories';
import styles from './HeroTags.module.css';

type HeroTagsClientProps = {
  categories: { slug: string; name: string }[];
};

export default function HeroTagsClient({ categories }: HeroTagsClientProps) {
  const searchParams = useSearchParams();
  const activeSlug = parseCategoryParam(searchParams.get('category'));
  const t = useTranslations('blog');

  return (
    <div className={styles.tags} role="tablist" aria-label={t('hero.categoriesLabel')}>
      <Link
        href={categoryHref()}
        role="tab"
        aria-selected={!activeSlug}
        className={`${styles.tag} ${!activeSlug ? styles.tagActive : ''}`}
      >
        {t('categories.All' as Parameters<typeof t>[0])}
      </Link>

      {categories.map(category => {
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
      })}
    </div>
  );
}
