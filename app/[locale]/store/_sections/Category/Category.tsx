'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Container } from '@/app/_components/Container/Container';
import styles from './Category.module.css';
import Tabs, { type Tab } from '@/app/_components/Tabs/Tabs';
import PrivilegesCards from '@/app/_components/PrivilegesCards/PrivilegesCards';
import CrystalsCards from '@/app/_components/CrystalsCards/CrystalsCards';
import GameItemsCards from '@/app/_components/GameItemsCards/GameItemsCards';
import { useShopSectionHref } from '@/lib/client/useShopSectionHref';
import { prefetchGameItems } from '@/lib/client/gameItemsCache';

const STORE_TABS = ['Crystals', 'Privileges', 'GameItems'] as const satisfies readonly Tab[];

function tabFromSearchParam(value: string | null): Tab | null {
  if (value === 'Crystals' || value === 'Privileges' || value === 'GameItems') return value;
  return null;
}

export default function Category({ isAuthed = false }: { isAuthed?: boolean }) {
  const t = useTranslations('store');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(
    () => tabFromSearchParam(searchParams.get('tab')) ?? 'Privileges',
  );
  const crystalsHref = useShopSectionHref(isAuthed, 'Crystals');
  const privilegesHref = useShopSectionHref(isAuthed, 'Privileges');
  const gameItemsHref = useShopSectionHref(isAuthed, 'GameItems');

  // Дефолтний таб — Privileges, і його картки статичні. Поки користувач їх
  // розглядає, тягнемо каталог блоків: до кліку на Game Items він уже буде тут.
  useEffect(() => {
    prefetchGameItems(locale, { limit: null });
  }, [locale]);

  useEffect(() => {
    const fromUrl = tabFromSearchParam(searchParams.get('tab'));
    if (!fromUrl) return;
    setActiveTab(fromUrl);
    document.getElementById('store-category')?.scrollIntoView({ block: 'start' });
  }, [searchParams]);

  return (
    <section id="store-category" className={styles.section}>
      <Container>
        <h2 className={styles.title}>{t('category_title')}</h2>

        <Tabs value={activeTab} onChange={setActiveTab} tabs={STORE_TABS} />

        <div className={styles.cards}>
          {activeTab === 'Crystals' ? (
            <CrystalsCards seeMoreHref={crystalsHref} />
          ) : activeTab === 'GameItems' ? (
            <GameItemsCards shopHref={gameItemsHref} />
          ) : (
            <PrivilegesCards addToCartHref={privilegesHref} />
          )}
        </div>
      </Container>
    </section>
  );
}
