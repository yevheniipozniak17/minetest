'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PAYMENT_METHODS, type PaymentMethodId } from '../paymentMethods';
import styles from './PaymentMethods.module.css';

type PaymentMethodsProps = {
  value: PaymentMethodId;
  onChange: (id: PaymentMethodId) => void;
  variant?: 'inline' | 'modal';
  ariaLabel?: string;
};

export function PaymentMethods({
  value,
  onChange,
  variant = 'inline',
  ariaLabel,
}: PaymentMethodsProps) {
  const t = useTranslations('cart');

  return (
    <div
      className={`${styles.grid} ${variant === 'modal' ? styles.gridModal : ''}`}
      role="radiogroup"
      aria-label={ariaLabel ?? t('paymentTitle')}
    >
      {PAYMENT_METHODS.map(method => {
        const active = value === method.id;
        return (
          <button
            key={method.id}
            type="button"
            role="radio"
            aria-checked={active}
            className={`${styles.tile} ${active ? styles.tileActive : ''}`}
            onClick={() => onChange(method.id)}
          >
            <span
              className={`${styles.icons} ${method.icons.length > 1 ? styles.iconsMulti : ''}`}
            >
              {method.icons.map(icon => (
                <Image
                  key={icon}
                  src={icon}
                  alt=""
                  width={56}
                  height={38}
                  className={styles.icon}
                  aria-hidden
                />
              ))}
            </span>
            <span className={styles.label}>{t(method.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
