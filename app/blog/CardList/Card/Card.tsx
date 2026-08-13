'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './Card.module.css';

export interface ArticleCardProps {
  image: string;
  genre: 'Guides' | 'Engineering' | 'PvP' | 'Community' | 'Updates' | 'Tutorials';
  time: number;
  title: string;
  description: string;
  date: Date | string;
  slug?: string;
  categoryLabel?: string;
}

export default function Card({
  image,
  genre,
  time,
  title,
  description,
  date,
  slug,
  categoryLabel,
}: ArticleCardProps) {
  const t = useTranslations('blog');
  const genreLabel =
    categoryLabel ??
    t(`categories.${genre}` as Parameters<typeof t>[0]);

  const content = (
    <>
      <Image src={image} className={styles.image} alt={title} width={335} height={200} />
      <div className={styles.card_content}>
        <div className={styles.content_header}>
          <span className={styles.genre}>{genreLabel}</span>
          <span className={styles.time}>⏱️ {t('card.readTime', { time })}</span>
        </div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.meta}>
          <span className={styles.date}>{date.toString()}</span>
        </div>
      </div>
    </>
  );

  return (
    <li className={styles.card}>
      {slug ? (
        <Link href={`/blog/${slug}`} className={styles.link}>
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}
