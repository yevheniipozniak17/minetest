'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import useEmblaCarousel from 'embla-carousel-react';
import Card from './Card/Card';
import styles from './CrystalsCards.module.css';

export type CrystalsCardProps = {
  title: string;
  text: string;
  icon: string;
};

type PackKey = 'pack1' | 'pack2' | 'pack3';

const PACK_DATA: { key: PackKey; icon: string }[] = [
  { key: 'pack1', icon: '/icons/illustrations/preview-green.webp' },
  { key: 'pack2', icon: '/icons/illustrations/preview-yellow.webp' },
  { key: 'pack3', icon: '/icons/illustrations/preview-blue.webp' },
];

export default function CrystalsCards({ seeMoreHref }: { seeMoreHref: string }) {
  const t = useTranslations('store');
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: false,
    breakpoints: {
      '(min-width: 1280px)': { active: false },
    },
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Embla doesn't emit `select` on initial mount, so sync the active index once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  return (
    <div className={styles.root}>
      <div className={styles.viewport} ref={emblaRef}>
        <ul className={styles.cards}>
          {PACK_DATA.map((item, index) => (
            <Card
              key={index}
              title={t(`crystalCard_${item.key}_title`)}
              text={t(`crystalCard_${item.key}_text`)}
              icon={item.icon}
              seeMoreHref={seeMoreHref}
            />
          ))}
        </ul>
      </div>

      <div className={styles.dots} role="tablist" aria-label={t('storeItems_ariaLabel')}>
        {PACK_DATA.map((item, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-label={`Go to ${t(`crystalCard_${item.key}_title`)}`}
            aria-selected={i === selectedIndex}
            className={`${styles.dot} ${i === selectedIndex ? styles.dotActive : ''}`}
            onClick={() => scrollTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
