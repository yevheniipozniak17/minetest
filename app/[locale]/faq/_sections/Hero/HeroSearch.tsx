'use client';

import { FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { FAQ_TOTAL_COUNT } from '@/app/[locale]/faq/_data/faqArticles';
import { useFaqPage } from '../FaqPageContext';
import styles from './Hero.module.css';

export default function HeroSearch() {
  const t = useTranslations('faq');
  const { searchInput, setSearchInput, applySearch } = useFaqPage();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applySearch();
  };

  return (
    <form className={styles.search} onSubmit={handleSubmit}>
      <span className={styles.searchIcon} aria-hidden="true">
        ⌕
      </span>
      <input
        className={`${styles.input} ${styles.inputMobile}`}
        type="search"
        placeholder={t('search.placeholderMobile', { count: FAQ_TOTAL_COUNT })}
        aria-label={t('search.ariaLabel')}
        value={searchInput}
        onChange={event => setSearchInput(event.target.value)}
      />
      <input
        className={`${styles.input} ${styles.inputDesktop}`}
        type="search"
        placeholder={t('search.placeholderDesktop', { count: FAQ_TOTAL_COUNT })}
        aria-label={t('search.ariaLabel')}
        value={searchInput}
        onChange={event => setSearchInput(event.target.value)}
      />
      <button type="submit" className={styles.searchButton}>
        <span className={styles.searchButtonMobile}>{t('search.go')}</span>
        <span className={styles.searchButtonDesktop}>{t('search.search')}</span>
      </button>
    </form>
  );
}
