'use client';
import { useState } from 'react';
import styles from './Tabs.module.css';

const TABS = ['Crystals', 'Privileges'] as const;
type Tab = (typeof TABS)[number];

export default function Tabs() {
  const [activeTab, setActiveTab] = useState<Tab>('Crystals');
  return (
    <div className={styles.tabs} role="tablist" aria-label="Store categories">
      {TABS.map(tab => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
