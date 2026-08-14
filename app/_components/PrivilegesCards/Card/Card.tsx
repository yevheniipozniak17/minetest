'use client';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { PrivilegesCardProps } from '../PrivilegesCards';
import styles from './Card.module.css';

type CardProps = PrivilegesCardProps & {
  compact?: boolean;
  price?: string;
  addHref?: string;
  onAdd?: () => void;
  pending?: boolean;
  done?: boolean;
};

export default function Card({
  title,
  text,
  icon,
  compact = false,
  price,
  addHref,
  onAdd,
  pending = false,
  done = false,
}: CardProps) {
  const t = useTranslations('store');
  const label = done ? t('privCard_added') : pending ? t('privCard_adding') : t('privCard_addToCart');

  const cta = (
    <>
      <Image
        src="/icons/icons/arrow-up.svg"
        alt=""
        width={24}
        height={24}
        aria-hidden
      />
      {label}
    </>
  );

  return (
    <li className={`${styles.card} ${compact ? styles.cardCompact : ''}`}>
      <Image className={styles.icon} src={icon} alt={title} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{text}</p>
      </div>
      {price && (
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>{t('privCard_price')}</span>
          <span className={styles.priceValue}>{price}</span>
        </div>
      )}
      {addHref ? (
        <Link href={addHref} className={styles.button}>
          {cta}
        </Link>
      ) : (
        <button
          type="button"
          className={styles.button}
          onClick={onAdd}
          disabled={pending}
        >
          {cta}
        </button>
      )}
    </li>
  );
}
