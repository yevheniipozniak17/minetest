'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { COUNTRY_KEYS } from '@/lib/data/countries';
import styles from './CountrySelect.module.css';

type CountrySelectProps = {
  id: string;
  value: string;
  countries: readonly string[];
  onChange: (value: string) => void;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
  transform?: string;
};

const MENU_GAP = 6;
const MENU_MAX_HEIGHT = 240;

function getMenuPosition(trigger: HTMLElement): MenuPosition {
  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP;
  const spaceAbove = rect.top - MENU_GAP;
  const openUp = spaceBelow < MENU_MAX_HEIGHT && spaceAbove > spaceBelow;

  if (openUp) {
    return {
      top: rect.top - MENU_GAP,
      left: rect.left,
      width: rect.width,
      transform: 'translateY(-100%)',
    };
  }

  return {
    top: rect.bottom + MENU_GAP,
    left: rect.left,
    width: rect.width,
  };
}

export default function CountrySelect({ id, value, countries, onChange }: CountrySelectProps) {
  const t = useTranslations('settings');

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const getCountryLabel = useCallback(
    (name: string) => {
      const key = COUNTRY_KEYS[name];
      return key ? t(`countries.${key}`) : name;
    },
    [t],
  );

  const options = useMemo(() => {
    const items = [{ value: '', label: t('countryNotSet') }];

    if (value && !countries.includes(value)) {
      items.push({ value, label: value });
    }

    for (const country of countries) {
      items.push({ value: country, label: getCountryLabel(country) });
    }

    return items;
  }, [countries, value, t, getCountryLabel]);

  const displayLabel = value ? getCountryLabel(value) : t('countryNotSet');

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    setMenuPosition(getMenuPosition(trigger));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuPosition(null);
      return;
    }

    updateMenuPosition();

    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const choose = (next: string) => {
    setOpen(false);
    if (next !== value) onChange(next);
  };

  const menu =
    open && menuPosition && mounted
      ? createPortal(
          <ul
            ref={menuRef}
            className={styles.menu}
            role="listbox"
            aria-labelledby={id}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
              transform: menuPosition.transform,
            }}
          >
            {options.map(option => (
              <li key={option.value || '__empty'} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  className={`${styles.option} ${value === option.value ? styles.optionActive : ''}`}
                  onClick={() => choose(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )
      : null;

  return (
    <>
      <div className={styles.wrap} ref={rootRef}>
        <button
          type="button"
          id={id}
          ref={triggerRef}
          className={styles.trigger}
          onClick={() => setOpen(current => !current)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {displayLabel}
        </button>
        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </div>
      {menu}
    </>
  );
}
