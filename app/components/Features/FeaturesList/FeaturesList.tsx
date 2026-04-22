'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { FeaturesCardProps } from '../FeaturesCard/FeaturesCard';
import FeaturesCard from '../FeaturesCard/FeaturesCard';
import styles from './FeaturesList.module.css';

const Data: FeaturesCardProps[] = [
  {
    title: 'Build & Create',
    text: 'Build freely. Shape your world.',
    description:
      'Create bases, cities, and landscapes with no limits. From small builds to massive projects — your imagination sets the rules.',
    icon: '/icons/icons/features-box.svg',
  },
  {
    title: 'Survive & Compete',
    text: 'Fight, survive, and dominate.',
    description:
      'Engage in PvP battles, raids, and survival challenges. Prove your skills and climb the rankings.',
    icon: '/icons/icons/features-crown.svg',
  },
  {
    title: 'Skins & Cosmetics',
    text: 'Stand out visually.',
    description:
      'Customize your character with unique skins, effects, and visual upgrades. No gameplay advantage — only style.',
    icon: '/icons/icons/features-mask.svg',
  },
  {
    title: 'In-game Economy',
    text: 'Trade. Earn. Progress.',
    description:
      'A balanced economy powered by in-game currency. Trade with players, buy upgrades, and grow your wealth.',
    icon: '/icons/icons/features-dollar.svg',
  },
  {
    title: 'Events & Tournaments',
    text: 'Competitive events coming soon.',
    description:
      'Seasonal events, PvP tournaments, and challenges with rewards. Stay tuned — big battles are ahead.',
    icon: '/icons/icons/features-calendar.svg',
  },
];

export default function FeaturesList() {
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

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  return (
    <div className={styles.root}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.track}>
          {Data.map((card, idx) => (
            <div className={styles.slide} key={idx}>
              <FeaturesCard {...card} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dots} role="tablist" aria-label="Game features">
        {Data.map((card, i) => (
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
