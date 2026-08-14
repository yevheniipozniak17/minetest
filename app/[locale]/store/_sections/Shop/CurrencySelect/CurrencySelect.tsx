'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Currency } from '@/lib/api/types';
import styles from './CurrencySelect.module.css';

type CurrencySelectProps = {
  value: string;
  currencies: Currency[];
  onChange: (abbr: string) => void;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
  transform?: string;
};

const MENU_GAP = 6;
const MENU_MAX_HEIGHT = 280;
const PRIMARY_CURRENCIES = ['EUR', 'USD'];

function sortCurrencies(currencies: Currency[]): Currency[] {
  return [...currencies].sort((a, b) => {
    const rankA = PRIMARY_CURRENCIES.indexOf(a.abbr);
    const rankB = PRIMARY_CURRENCIES.indexOf(b.abbr);
    const orderA = rankA === -1 ? PRIMARY_CURRENCIES.length : rankA;
    const orderB = rankB === -1 ? PRIMARY_CURRENCIES.length : rankB;
    if (orderA !== orderB) return orderA - orderB;
    return a.abbr.localeCompare(b.abbr);
  });
}

function getMenuPosition(trigger: HTMLElement): MenuPosition {
  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP;
  const spaceAbove = rect.top - MENU_GAP;
  const openUp = spaceBelow < MENU_MAX_HEIGHT && spaceAbove > spaceBelow;
  const alignEnd = rect.left + rect.width / 2 > window.innerWidth / 2;

  return {
    top: openUp ? rect.top - MENU_GAP : rect.bottom + MENU_GAP,
    left: alignEnd ? rect.right : rect.left,
    width: rect.width,
    transform: openUp
      ? alignEnd
        ? 'translate(-100%, -100%)'
        : 'translateY(-100%)'
      : alignEnd
        ? 'translateX(-100%)'
        : undefined,
  };
}

export default function CurrencySelect({ value, currencies, onChange }: CurrencySelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const hasOptions = currencies.length > 1;
  const sortedCurrencies = useMemo(() => sortCurrencies(currencies), [currencies]);

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
            aria-label="Select currency"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
              transform: menuPosition.transform,
            }}
          >
            {sortedCurrencies.map(item => (
              <li key={item.abbr} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={value === item.abbr}
                  className={`${styles.option} ${value === item.abbr ? styles.optionActive : ''}`}
                  onClick={() => choose(item.abbr)}
                >
                  <span className={styles.optionAbbr}>{item.abbr}</span>
                  {item.name && <span className={styles.optionName}>{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div className={styles.wrap} ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className={`${styles.trigger} ${hasOptions ? '' : styles.triggerStatic}`}
        onClick={() => hasOptions && setOpen(current => !current)}
        aria-haspopup={hasOptions ? 'listbox' : undefined}
        aria-expanded={hasOptions ? open : undefined}
        disabled={!hasOptions}
      >
        <span className={styles.label}>Currency:</span>
        <span className={styles.value}>{value}</span>
        {hasOptions && (
          <span className={`${styles.caret} ${open ? styles.caretOpen : ''}`} aria-hidden="true">
            ▾
          </span>
        )}
      </button>
      {menu}
    </div>
  );
}
