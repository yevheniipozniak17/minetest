'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Container } from '@/app/_components/Container/Container';
import styles from './Category.module.css';
import Tabs, { type Tab } from '@/app/_components/Tabs/Tabs';
import PrivilegesCards from '@/app/_components/PrivilegesCards/PrivilegesCards';
import CrystalsCards from '@/app/_components/CrystalsCards/CrystalsCards';
import { getShopHref } from '@/lib/data/servers';

export default function Category({ isAuthed = false }: { isAuthed?: boolean }) {
  const t = useTranslations('store');
  const [activeTab, setActiveTab] = useState<Tab>('Privileges');
  const shopHref = getShopHref(isAuthed);

  return (
    <section className={styles.section}>
      <Container>
        <h2 className={styles.title}>{t('category_title')}</h2>

        <Tabs value={activeTab} onChange={setActiveTab} />

        <div className={styles.cards}>
          {activeTab === 'Crystals' ? (
            <CrystalsCards seeMoreHref={shopHref} />
          ) : (
            <PrivilegesCards addToCartHref={shopHref} />
          )}
        </div>
      </Container>
    </section>
  );
}
