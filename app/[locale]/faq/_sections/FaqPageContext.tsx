'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { filterFaqArticles } from '@/app/[locale]/faq/_data/faqArticles';
import { DEFAULT_FAQ_CATEGORY, FAQ_DEFAULT_ITEMS_PER_PAGE, FAQ_DEFAULT_SORT, type FaqCategoryId, type FaqPageSize, type FaqSortOption } from './faqCategories';

type FaqPageContextValue = {
  activeCategory: FaqCategoryId;
  setActiveCategory: (category: FaqCategoryId) => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
  searchQuery: string;
  applySearch: () => void;
  clearSearch: () => void;
  resultCount: number;
  itemsPerPage: FaqPageSize;
  setItemsPerPage: (size: FaqPageSize) => void;
  sortOption: FaqSortOption;
  setSortOption: (sort: FaqSortOption) => void;
};

const FaqPageContext = createContext<FaqPageContextValue | null>(null);

export function FaqPageProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId>(DEFAULT_FAQ_CATEGORY);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState<FaqPageSize>(FAQ_DEFAULT_ITEMS_PER_PAGE);
  const [sortOption, setSortOption] = useState<FaqSortOption>(FAQ_DEFAULT_SORT);

  const resultCount = useMemo(
    () => filterFaqArticles(activeCategory, searchQuery).length,
    [activeCategory, searchQuery],
  );

  const applySearch = useCallback(() => {
    const nextQuery = searchInput.trim();
    setSearchQuery(nextQuery);
    requestAnimationFrame(() => {
      document.getElementById('faq-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [searchInput]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
  }, []);

  const handleCategoryChange = useCallback((category: FaqCategoryId) => {
    setActiveCategory(category);
  }, []);

  const value = useMemo(
    () => ({
      activeCategory,
      setActiveCategory: handleCategoryChange,
      searchInput,
      setSearchInput,
      searchQuery,
      applySearch,
      clearSearch,
      resultCount,
      itemsPerPage,
      setItemsPerPage,
      sortOption,
      setSortOption,
    }),
    [
      activeCategory,
      handleCategoryChange,
      searchInput,
      searchQuery,
      applySearch,
      clearSearch,
      resultCount,
      itemsPerPage,
      sortOption,
    ],
  );

  return <FaqPageContext.Provider value={value}>{children}</FaqPageContext.Provider>;
}

export function useFaqPage() {
  const context = useContext(FaqPageContext);
  if (!context) {
    throw new Error('useFaqPage must be used within FaqPageProvider');
  }
  return context;
}
