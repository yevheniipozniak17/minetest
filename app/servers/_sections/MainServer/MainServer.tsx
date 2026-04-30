'use client';

import { useState } from 'react';
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

export default function MainServer() {
  const [activeTab, setActiveTab] = useState<TabId>('lucky');

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

        <ActiveComponent />
      </Container>
    </section>
  );
}
