'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { categoryHref, parseCategoryParam } from '../categories';
import styles from './HeroTags.module.css';

type Category = { slug: string; name: string };

type HeroTagsClientProps = {
  categories: Category[];
};

/* Скільки чипів лишити у видимому ряду на десктопі, рахуємо з довжини назв,
   а не фіксованим числом: категорії приходять з API і їхня кількість та
   довжина змінюються, а ряд мусить лишатися одним рядком. Реальні ширини
   доступні лише після монтування, тому оцінюємо через довжину тексту —
   розкладка виходить однакова на сервері й клієнті. Оцінка завищена: краще
   показати на один чип менше, ніж дати ряду переповнитись. */
const ROW_WIDTH = 1100;
const TRIGGER_WIDTH = 140;
const CHIP_GAP = 10;
const CHIP_PADDING = 28;
const CHAR_WIDTH = 10;

function fitChipCount(labels: string[], budget: number) {
  let used = 0;
  let count = 0;

  for (const label of labels) {
    const width = CHIP_PADDING + label.length * CHAR_WIDTH;
    const next = count === 0 ? width : used + CHIP_GAP + width;
    if (next > budget) break;
    used = next;
    count += 1;
  }

  return count;
}

function Chevron({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 12 8" aria-hidden="true" focusable="false">
      <path
        d="M1 1.5 6 6.5l5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroTagsClient({ categories }: HeroTagsClientProps) {
  const searchParams = useSearchParams();
  const activeSlug = parseCategoryParam(searchParams.get('category'));
  const t = useTranslations('blog');
  const allLabel = t('categories.All' as Parameters<typeof t>[0]);

  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Склад видимого ряду однаковий на всіх сторінках: варто йому змінитися —
  // і центрований ряд поїде вбік при переході між категоріями. Тому вибрану
  // категорію з дропдауна не піднімаємо в ряд, а позначаємо на тригері.
  const headCount = Math.max(
    0,
    fitChipCount(
      [allLabel, ...categories.map(category => category.name)],
      ROW_WIDTH - TRIGGER_WIDTH - CHIP_GAP
    ) - 1
  );

  const headTags = categories.slice(0, headCount);
  const tailTags = categories.slice(headCount);
  const hasOverflow = tailTags.length > 0;
  const hasHiddenActive =
    !!activeSlug && tailTags.some(category => category.slug === activeSlug);
  const activeName = categories.find(c => c.slug === activeSlug)?.name ?? allLabel;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (listRef.current?.contains(target)) return;
      if (selectorRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      const visibleTrigger = selectorRef.current?.offsetParent
        ? selectorRef.current
        : triggerRef.current;
      visibleTrigger?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const renderChip = (category: Category) => {
    const isActive = category.slug === activeSlug;
    return (
      <Link
        key={category.slug}
        href={categoryHref(category.slug)}
        role="tab"
        aria-selected={isActive}
        className={`${styles.tag} ${isActive ? styles.tagActive : ''}`}
        onClick={() => setOpen(false)}
      >
        {category.name}
      </Link>
    );
  };

  return (
    // Обгортка потрібна лише мобілці — вона є точкою прив'язки для дропдауна
    // під селектором. На десктопі стає display: contents, щоб ряд чипів
    // лишався прямим елементом розкладки героя.
    <div className={styles.root}>
      {/* Мобілка: замість ряду чипів — один селектор на всю ширину (як поле
          пошуку вище). Ряд із 16 категорій там або розповзався на 10 рядів,
          або обрізався в горизонтальному скролі. */}
      <button
        type="button"
        ref={selectorRef}
        className={`${styles.selector} ${activeSlug ? styles.selectorFiltered : ''}`}
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-controls="hero-tags"
        aria-label={`${t('hero.categoryLabel')}: ${activeName}`}
      >
        {/* Підпис лишається лише в стані «всі категорії»: разом із довгою
            назвою він не влазить у ширину селектора, а вибрана категорія й
            без нього зрозуміла. Для скрінрідера підпис є в aria-label. */}
        {!activeSlug && (
          <span className={styles.selectorLabel}>{t('hero.categoryLabel')}</span>
        )}
        <span className={styles.selectorValue}>{activeName}</span>
        <Chevron className={styles.selectorChevron} />
      </button>

      {/* Один і той самий список: на десктопі — ряд чипів, на мобілці —
          дропдаун під селектором. Теги завжди в DOM, тому для краулерів
          різниці немає. */}
      <div
        id="hero-tags"
        ref={listRef}
        className={`${styles.tags} ${open ? styles.tagsOpen : ''}`}
        role="tablist"
        aria-label={t('hero.categoriesLabel')}
      >
        <Link
          href={categoryHref()}
          role="tab"
          aria-selected={!activeSlug}
          className={`${styles.tag} ${!activeSlug ? styles.tagActive : ''}`}
          onClick={() => setOpen(false)}
        >
          {allLabel}
        </Link>

        {headTags.map(renderChip)}

        {hasOverflow && (
          <div className={styles.more}>
            <button
              type="button"
              ref={triggerRef}
              className={`${styles.tag} ${styles.tagToggle} ${
                hasHiddenActive ? styles.tagToggleActive : ''
              }`}
              onClick={() => setOpen(value => !value)}
              aria-expanded={open}
              aria-controls="hero-tags-more"
            >
              {/* Обидва підписи лишаються в розмітці й накладаються в одну
                  grid-клітинку: ширина тригера не змінюється при відкриванні,
                  інакше центрований ряд чипів смикається вбік. */}
              <span className={styles.toggleLabel}>
                <span
                  className={`${styles.toggleOption} ${open ? '' : styles.toggleOptionActive}`}
                >
                  +{tailTags.length} more
                </span>
                <span
                  className={`${styles.toggleOption} ${open ? styles.toggleOptionActive : ''}`}
                >
                  Show less
                </span>
              </span>
              <Chevron className={styles.chevron} />
            </button>

            <div
              id="hero-tags-more"
              className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
            >
              {tailTags.map(renderChip)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
