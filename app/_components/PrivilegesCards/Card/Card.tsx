'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { PrivilegesCardProps } from '../PrivilegesCards';
import styles from './Card.module.css';

type CardProps = PrivilegesCardProps & {
  compact?: boolean;
  price?: string;
  details?: string[];
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
  details,
  addHref,
  onAdd,
  pending = false,
  done = false,
}: CardProps) {
  const t = useTranslations('store');
  const [open, setOpen] = useState(false);
  const hasDetails = Array.isArray(details) && details.length > 0;
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
    <li
      className={`${styles.card} ${compact ? styles.cardCompact : ''} ${
        open ? styles.open : ''
      }`}
    >
      <Image className={styles.icon} src={icon} alt={title} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{text}</p>

        {hasDetails && (
          <div className={styles.details}>
            <button
              type="button"
              className={styles.detailsToggle}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? t('privCard_hideDetails') : t('privCard_details')}
              <Image
                src={open ? '/icons/icons/button-up.svg' : '/icons/icons/button-down.svg'}
                alt=""
                width={24}
                height={24}
                aria-hidden
              />
            </button>
            <div className={styles.detailsWrapper}>
              <ul className={styles.detailsList}>
                {details!.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
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
