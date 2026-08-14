'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useTranslations } from 'next-intl';
import {
  GAME_SERVERS,
  getServerConnectAddress,
  MINECRAFT_VERSION_LABEL,
  type GameServerKey,
} from '@/lib/server/gameServers';
import type { CardProps } from '../Card/Card';
import { Card } from '../Card/Card';
import styles from './CardList.module.css';

const SERVER_IDS: { id: GameServerKey; title: string; icon: string }[] = [
  { id: 'luckysurvival', title: 'LuckySurvival', icon: '/home/images/server-1.webp' },
  { id: 'minewars', title: 'MineWars', icon: '/home/images/server-2.webp' },
  { id: 'calmsky', title: 'CalmSky', icon: '/home/images/server-3.webp' },
];

export default function CardList() {
  const t = useTranslations('home');

  const CARDS: (Omit<CardProps, 'connectAddress' | 'version' | 'serverId'> & {
    id: GameServerKey;
  })[] = SERVER_IDS.map(({ id, title, icon }) => ({
      id,
      title,
      icon,
      difficulty: GAME_SERVERS[id].difficulty,
      text: t(`server.${id}.text`),
      description: t(`server.${id}.description`),
    }));

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
        <div className={styles.track}>
          {CARDS.map(card => (
            <div className={styles.slide} key={card.id}>
              <Card
                {...card}
                serverId={card.id}
                version={MINECRAFT_VERSION_LABEL}
                connectAddress={getServerConnectAddress(card.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dots} role="tablist" aria-label={t('server.carouselAriaLabel')}>
        {CARDS.map((card, i) => (
          <button
            key={card.id}
            type="button"
            role="tab"
            aria-label={t('server.goToServer', { title: card.title })}
            aria-selected={i === selectedIndex}
            className={`${styles.dot} ${i === selectedIndex ? styles.dotActive : ''}`}
            onClick={() => scrollTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
