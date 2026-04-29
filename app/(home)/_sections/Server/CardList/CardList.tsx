'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { CardProps } from '../Card/Card';
import { Card } from '../Card/Card';
import styles from './CardList.module.css';

const CARDS: CardProps[] = [
  {
    title: 'Lucky Survival',
    text: 'Classic survival with balanced PvP',
    description:
      'Vanilla survival with PvP and TNT disabled. Perfect for fair fights, progression, and long-term gameplay.',
    icon: '/icons/illustrations/server-1.svg',
    link: '#',
  },
  {
    title: 'MineWars',
    text: 'Total freedom. Total chaos.',
    description:
      'Vanilla survival with PvP and TNT enabled. Build, destroy, raid, or dominate — no limits on playstyle.',
    icon: '/icons/illustrations/server-2.svg',
    link: '#',
  },
  {
    title: 'CalmSky',
    text: 'Build, relax, and connect',
    description:
      'Peaceful vanilla server without PvP or TNT. Focus on creativity, social play, and beautiful builds.',
    icon: '/icons/illustrations/server-3.svg',
    link: '#',
  },
];

export default function CardList() {
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
          {CARDS.map(card => (
            <div className={styles.slide} key={card.title}>
              <Card {...card} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dots} role="tablist" aria-label="Servers">
        {CARDS.map((card, i) => (
          <button
            key={card.title}
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
