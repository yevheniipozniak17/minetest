'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Card from './Card/Card';
import styles from './CrystalsCards.module.css';

export type CrystalsCardProps = {
  title: string;
  text: string;
  icon: string;
};

const Data: CrystalsCardProps[] = [
  {
    title: '500 Crystals',
    text: 'Start your journey.',
    icon: '/icons/illustrations/preview-green.svg',
  },
  {
    title: '1,500 Crystals',
    text: 'Best value for active players.',
    icon: '/icons/illustrations/preview-yellow.svg',
  },
  {
    title: '5,000 Crystals',
    text: 'For serious progression.',
    icon: '/icons/illustrations/preview-blue.svg',
  },
];

export default function CrystalsCards() {
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
        <ul className={styles.cards}>
          {Data.map((item, index) => (
            <Card key={index} title={item.title} text={item.text} icon={item.icon} />
          ))}
        </ul>
      </div>

      <div className={styles.dots} role="tablist" aria-label="Store items">
        {Data.map((item, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-label={`Go to ${item.title}`}
            aria-selected={i === selectedIndex}
            className={`${styles.dot} ${i === selectedIndex ? styles.dotActive : ''}`}
            onClick={() => scrollTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
