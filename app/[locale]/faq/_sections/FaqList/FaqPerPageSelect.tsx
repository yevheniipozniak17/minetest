'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FAQ_PAGE_SIZE_OPTIONS, type FaqPageSize } from '../faqCategories';
import styles from './FaqList.module.css';

type FaqPerPageSelectProps = {
  value: FaqPageSize;
  onChange: (size: FaqPageSize) => void;
};

export default function FaqPerPageSelect({ value, onChange }: FaqPerPageSelectProps) {
  const t = useTranslations('faq');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const choose = (size: FaqPageSize) => {
    setOpen(false);
    if (size !== value) {
      onChange(size);
    }
  };

  return (
    <div className={styles.perPageWrap} ref={rootRef}>
      <button
        type="button"
        className={styles.pagPerPage}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
      >
        <span className={styles.pagPerPageLabel}>{t('list.perPage')}</span>
        <span className={styles.pagPerPageValue}>{value}</span>
        <span className={`${styles.pagPerPageChevron} ${open ? styles.pagPerPageChevronOpen : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <ul className={styles.perPageMenu} role="listbox" aria-label={t('list.perPageAriaLabel')}>
          {FAQ_PAGE_SIZE_OPTIONS.map(size => (
            <li key={size} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === size}
                className={`${styles.perPageOption} ${value === size ? styles.perPageOptionActive : ''}`}
                onClick={() => choose(size)}
              >
                {size}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
