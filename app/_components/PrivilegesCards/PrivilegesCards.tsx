'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { StaticImageData } from 'next/image';
import Card from './Card/Card';
import styles from './PrivilegesCards.module.css';
import image1 from '@/public/privileges/images/1.png';
import image2 from '@/public/privileges/images/2.png';
import image3 from '@/public/privileges/images/3.png';
import image4 from '@/public/privileges/images/4.png';
import image5 from '@/public/privileges/images/5.png';
import image6 from '@/public/privileges/images/6.png';
import image7 from '@/public/privileges/images/7.png';
import image8 from '@/public/privileges/images/8.png';

export type PrivilegesCardProps = {
  title: string;
  text: string;
  icon: StaticImageData;
};

const Data: { title: string; icon: StaticImageData }[] = [
  { title: 'Silver', icon: image1 },
  { title: 'Supreme', icon: image2 },
  { title: 'Wither', icon: image3 },
  { title: 'Hero', icon: image4 },
  { title: 'Avenger', icon: image5 },
  { title: 'Legend', icon: image6 },
  { title: 'Phantom', icon: image7 },
  { title: 'Phoenix', icon: image8 },
];

function priceForTitle(title: string, prices?: Record<string, string>): string | undefined {
  if (!prices) return undefined;
  if (prices[title]) return prices[title];
  const key = Object.keys(prices).find(k => k.toLowerCase() === title.toLowerCase());
  return key ? prices[key] : undefined;
}

type PrivilegesCardsProps = {
  initialLimit?: number;
  /** When set, "View more" navigates here instead of expanding inline. */
  viewMoreHref?: string;
  /** Smaller cards for the narrower dashboard content area. */
  compact?: boolean;
  /** Formatted price per tier title, e.g. { Silver: '20.00 EUR' }. */
  pricesByTitle?: Record<string, string>;
  /** When set, "Add to cart" navigates here (e.g. public store or dashboard shop). */
  addToCartHref?: string;
  /** When provided, the "Add to cart" button on each card is wired to this. */
  onAddToCart?: (title: string) => Promise<void> | void;
};

export default function PrivilegesCards({
  initialLimit,
  viewMoreHref,
  compact = false,
  pricesByTitle,
  addToCartHref,
  onAddToCart,
}: PrivilegesCardsProps) {
  const t = useTranslations('store');
  const [expanded, setExpanded] = useState(false);
  const [pendingTitle, setPendingTitle] = useState<string | null>(null);
  const [doneTitles, setDoneTitles] = useState<Set<string>>(new Set());

  const hasMore = initialLimit != null && Data.length > initialLimit;
  const visible = hasMore && !expanded ? Data.slice(0, initialLimit) : Data;
  const showViewMore = hasMore && !expanded;

  const handleAdd = async (title: string) => {
    if (!onAddToCart || pendingTitle) return;
    setPendingTitle(title);
    try {
      await onAddToCart(title);
      setDoneTitles(prev => new Set(prev).add(title));
    } catch {
      // Error is shown by the parent component (Shop) via its own notice.
    } finally {
      setPendingTitle(null);
    }
  };

  return (
    <div className={styles.root}>
      <ul className={`${styles.cards} ${compact ? styles.cardsCompact : ''}`}>
        {visible.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            text={t(`privCard_${item.title.toLowerCase()}`)}
            details={t.raw(`privDetails_${item.title.toLowerCase()}`) as string[]}
            icon={item.icon}
            compact={compact}
            price={priceForTitle(item.title, pricesByTitle)}
            addHref={addToCartHref}
            onAdd={!addToCartHref && onAddToCart ? () => handleAdd(item.title) : undefined}
            pending={pendingTitle === item.title}
            done={doneTitles.has(item.title)}
          />
        ))}
      </ul>

      {showViewMore && (
        <div className={styles.viewMore}>
          {viewMoreHref ? (
            <Link href={viewMoreHref} className={styles.viewMoreBtn}>
              {t('privCard_viewMore')}
            </Link>
          ) : (
            <button
              type="button"
              className={styles.viewMoreBtn}
              onClick={() => setExpanded(true)}
            >
              {t('privCard_viewMore')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
