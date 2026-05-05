'use client';

import { useState } from 'react';
import styles from './Preview.module.css';
import CrystalsCards from '@/app/_components/CrystalsCards/CrystalsCards';
import PrivilegesCards from '@/app/_components/PrivilegesCards/PrivilegesCards';
import { Divider } from '../../../_components/Divider/Divider';
import Tabs, { type Tab } from '@/app/_components/Tabs/Tabs';

export default function Preview() {
  const [activeTab, setActiveTab] = useState<Tab>('Crystals');

  return (
    <>
      <section className={styles.preview}>
        <h2 className={styles.title}>Store Preview</h2>

        <Tabs value={activeTab} onChange={setActiveTab} />

        <div className={styles.cards}>
          {activeTab === 'Crystals' ? <CrystalsCards /> : <PrivilegesCards />}
        </div>
      </section>
      <Divider />
    </>
  );
}
