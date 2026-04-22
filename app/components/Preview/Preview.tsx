'use client';

import { useState } from 'react';
import styles from './Preview.module.css';
import PreviewList from './PreviewList/PreviewList';
import { Divider } from '../Divider/Divider';

export type PreviewCardProps = {
  title: string;
  text: string;

  icon: string;
};

const Data: PreviewCardProps[] = [
  {
    title: '500 Crystals',
    text: 'Start your journey.',
    icon: '/icons/illustrations/preview-green.svg',
  },
  {
    title: '1,500 Crystals',
    text: 'Best value for active players.',
    icon: '/icons/illustrations/preview-yellow.svg',
  },
  {
    title: '5,000 Crystals',
    text: 'For serious progression.',
    icon: '/icons/illustrations/preview-blue.svg',
  },
];

const TABS = ['Crystals', 'Privileges'] as const;
type Tab = (typeof TABS)[number];

export default function Preview() {
  const [activeTab, setActiveTab] = useState<Tab>('Crystals');

  return (
    <>
      <section className={styles.preview}>
        <h2 className={styles.title}>Store Preview</h2>

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

        <PreviewList items={Data} />
      </section>
      <Divider />
    </>
  );
}
