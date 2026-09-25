'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import styles from './Preview.module.css';
import CrystalsCards from '@/app/_components/CrystalsCards/CrystalsCards';
import PrivilegesCards from '@/app/_components/PrivilegesCards/PrivilegesCards';
import GameItemsCards from '@/app/_components/GameItemsCards/GameItemsCards';
import { Container } from '@/app/_components/Container/Container';
import { Divider } from '@/app/_components/Divider/Divider';
import Tabs, { type Tab } from '@/app/_components/Tabs/Tabs';
import { getStoreHref } from '@/lib/data/servers';
import { useShopSectionHref } from '@/lib/client/useShopSectionHref';
import { prefetchGameItems } from '@/lib/client/gameItemsCache';

const PREVIEW_TABS = ['Crystals', 'Privileges', 'GameItems'] as const satisfies readonly Tab[];

export default function Preview({ isAuthed = false }: { isAuthed?: boolean }) {
  const t = useTranslations('home');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<Tab>('Crystals');
  const storeHref = getStoreHref(isAuthed);
  const gameItemsHref = useShopSectionHref(isAuthed, 'GameItems');

  useEffect(() => {
    prefetchGameItems(locale, { limit: null });
  }, [locale]);

  return (
    <>
      <section className={styles.preview}>
        <Container>
          <h2 className={styles.title}>{t('preview.title')}</h2>

          <Tabs value={activeTab} onChange={setActiveTab} tabs={PREVIEW_TABS} />

          <div className={styles.cards}>
            {activeTab === 'Crystals' ? (
              <CrystalsCards seeMoreHref={storeHref} />
            ) : activeTab === 'Privileges' ? (
              <PrivilegesCards
                initialLimit={3}
                viewMoreHref={storeHref}
                addToCartHref={storeHref}
              />
            ) : (
              <GameItemsCards
                shopHref={gameItemsHref}
                initialLimit={6}
                viewMoreHref="/store?tab=GameItems"
              />
            )}
          </div>
        </Container>
      </section>
      <Divider />
    </>
  );
}
