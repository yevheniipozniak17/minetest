'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Preview.module.css';
import CrystalsCards from '@/app/_components/CrystalsCards/CrystalsCards';
import PrivilegesCards from '@/app/_components/PrivilegesCards/PrivilegesCards';
import { Container } from '@/app/_components/Container/Container';
import { Divider } from '@/app/_components/Divider/Divider';
import Tabs, { type Tab } from '@/app/_components/Tabs/Tabs';
import { getStoreHref } from '@/lib/data/servers';

export default function Preview({ isAuthed = false }: { isAuthed?: boolean }) {
  const t = useTranslations('home');
  const [activeTab, setActiveTab] = useState<Tab>('Crystals');
  const storeHref = getStoreHref(isAuthed);

  return (
    <>
      <section className={styles.preview}>
        <Container>
          <h2 className={styles.title}>{t('preview.title')}</h2>

          <Tabs value={activeTab} onChange={setActiveTab} />

          <div className={styles.cards}>
            {activeTab === 'Crystals' ? (
              <CrystalsCards seeMoreHref={storeHref} />
            ) : (
              <PrivilegesCards
                initialLimit={3}
                viewMoreHref={storeHref}
                addToCartHref={storeHref}
              />
            )}
          </div>
        </Container>
      </section>
      <Divider />
    </>
  );
}
