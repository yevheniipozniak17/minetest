'use client';

import { useState } from 'react';
import { Container } from '@/app/_components/Container/Container';
import styles from './Category.module.css';
import Tabs, { type Tab } from '@/app/_components/Tabs/Tabs';
import PrivilegesCards from '@/app/_components/PrivilegesCards/PrivilegesCards';
import CrystalsCards from '@/app/_components/CrystalsCards/CrystalsCards';

export default function Category() {
  const [activeTab, setActiveTab] = useState<Tab>('Privileges');

  return (
    <section className={styles.section}>
      <Container>
        <h2 className={styles.title}>Category</h2>

        <Tabs value={activeTab} onChange={setActiveTab} />

        <div className={styles.cards}>
          {activeTab === 'Crystals' ? <CrystalsCards /> : <PrivilegesCards />}
        </div>
      </Container>
    </section>
  );
}
