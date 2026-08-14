'use client';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { CrystalsCardProps } from '../CrystalsCards';
import styles from './Card.module.css';

type CardProps = CrystalsCardProps & {
  seeMoreHref: string;
};

export default function Card({ title, text, icon, seeMoreHref }: CardProps) {
  const t = useTranslations('store');
  return (
    <li className={styles.slide}>
      <article className={styles.card}>
        <Image className={styles.icon} src={icon} alt={title} width={177} height={124} />
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{text}</p>
        <Link
          href={seeMoreHref}
          className={styles.button}
          aria-label={t('crystalCard_seeMoreAriaLabel', { title })}
        >
          <Image
            src="/icons/icons/arrow-up.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden
          />
          {t('crystalCard_seeMore')}
        </Link>
      </article>
    </li>
  );
}
