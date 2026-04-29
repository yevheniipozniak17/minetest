'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import FeaturesCard from '../FeaturesCard/FeaturesCard';
import styles from './FeaturesList.module.css';
import type { FeaturesCardProps } from '../Features';

export type FeaturesListProps = {
  items: FeaturesCardProps[];
};

export default function FeaturesList({ items }: FeaturesListProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: false,
    breakpoints: {
      '(min-width: 1024px)': { active: false },
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
        <div className={styles.track}>
          {items.map((card, idx) => (
            <div className={styles.slide} key={idx}>
              <FeaturesCard
                title={card.title}
                text={card.text}
                description={card.description}
                icon={card.icon}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dots} role="tablist" aria-label="Game features">
        {items.map((card, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-label={`Go to ${card.title}`}
            aria-selected={i === selectedIndex}
            className={`${styles.dot} ${i === selectedIndex ? styles.dotActive : ''}`}
            onClick={() => scrollTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
