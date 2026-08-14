'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/app/_components/Container/Container';
import styles from './MainServer.module.css';
import LuckySurvival from './LuckySurvival/LuckySurvival';
import MineWars from './MineWars/MineWars';
import CalmSky from './CalmSky/CalmSky';

const TABS = [
  { id: 'lucky', label: 'LuckySurvival', Component: LuckySurvival },
  { id: 'minewars', label: 'MineWars', Component: MineWars },
  { id: 'calmsky', label: 'CalmSky', Component: CalmSky },
] as const;

type TabId = (typeof TABS)[number]['id'];

const TAB_IDS = new Set<TabId>(TABS.map(tab => tab.id));

function getTabFromHash(): TabId | null {
  const hash = window.location.hash.slice(1);
  return TAB_IDS.has(hash as TabId) ? (hash as TabId) : null;
}

export default function MainServer({ isAuthed = false }: { isAuthed?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabId>('lucky');

  useEffect(() => {
    const syncTabFromHash = () => {
      const tab = getTabFromHash();
      if (tab) setActiveTab(tab);
    };

    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);

    return () => window.removeEventListener('hashchange', syncTabFromHash);
  }, []);

  const ActiveComponent =
    TABS.find((tab) => tab.id === activeTab)?.Component ?? LuckySurvival;

  return (
    <section className={styles.section}>
      <Container>
        <ul className={styles.list}>
          {TABS.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                className={`${styles.button} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <ActiveComponent isAuthed={isAuthed} />
      </Container>
    </section>
  );
}
