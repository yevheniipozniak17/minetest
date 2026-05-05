'use client';
import styles from './Tabs.module.css';

export const TABS = ['Crystals', 'Privileges'] as const;
export type Tab = (typeof TABS)[number];

type TabsProps = {
  value: Tab;
  onChange: (tab: Tab) => void;
};

export default function Tabs({ value, onChange }: TabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Store categories">
      {TABS.map(tab => {
        const isActive = tab === value;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            onClick={() => onChange(tab)}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
