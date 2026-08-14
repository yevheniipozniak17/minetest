import { FAQ_ARTICLES, getCategoryCounts } from '../_data/faqArticles';
import type { FaqCategoryId, FaqSortOption } from '../_data/faqTypes';

export type { FaqCategoryId } from '../_data/faqTypes';

export type FaqCategory = {
  id: FaqCategoryId;
  label: string;
  mobileLabel: string;
  count: number;
};

const CATEGORY_COUNTS = getCategoryCounts();

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: 'all', label: 'All questions', mobileLabel: 'All', count: FAQ_ARTICLES.length },
  {
    id: 'getting-started',
    label: 'Getting started',
    mobileLabel: 'Getting started',
    count: CATEGORY_COUNTS['getting-started'],
  },
  { id: 'account', label: 'Account & login', mobileLabel: 'Account', count: CATEGORY_COUNTS.account },
  { id: 'payments', label: 'Payments', mobileLabel: 'Payments', count: CATEGORY_COUNTS.payments },
  { id: 'servers', label: 'Servers & worlds', mobileLabel: 'Servers', count: CATEGORY_COUNTS.servers },
  { id: 'privileges', label: 'Privileges', mobileLabel: 'Privileges', count: CATEGORY_COUNTS.privileges },
  { id: 'gameplay', label: 'Gameplay', mobileLabel: 'Gameplay', count: CATEGORY_COUNTS.gameplay },
  {
    id: 'technical',
    label: 'Technical issues',
    mobileLabel: 'Technical issues',
    count: CATEGORY_COUNTS.technical,
  },
  { id: 'rules', label: 'Rules & moderation', mobileLabel: 'Rules', count: CATEGORY_COUNTS.rules },
];

export const FAQ_MOST_ASKED = [
  { num: '01', question: 'How do I join the server?', slug: 'join' },
  { num: '02', question: 'What versions do you support?', slug: 'supported-versions' },
  { num: '03', question: 'How do I reset my password?', slug: 'reset-password' },
  { num: '04', question: 'How do refunds work?', slug: 'refund-policy' },
  { num: '05', question: 'Why am I getting connection lost?', slug: 'connection-lost' },
] as const;

export const DEFAULT_FAQ_CATEGORY: FaqCategoryId = 'all';

export const FAQ_MOBILE_CHIP_IDS: FaqCategoryId[] = [
  'all',
  'getting-started',
  'account',
  'payments',
  'servers',
  'privileges',
  'gameplay',
];

export const FAQ_DEFAULT_ITEMS_PER_PAGE = 8;

export const FAQ_PAGE_SIZE_OPTIONS = [8, 10, 15] as const;

export type FaqPageSize = (typeof FAQ_PAGE_SIZE_OPTIONS)[number];

export const FAQ_SORT_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'latest', label: 'Latest' },
] as const satisfies ReadonlyArray<{ id: FaqSortOption; label: string }>;

export type { FaqSortOption };

export const FAQ_DEFAULT_SORT: FaqSortOption = 'all';

export function getFaqSortLabel(sort: FaqSortOption): string {
  return FAQ_SORT_OPTIONS.find(option => option.id === sort)?.label ?? 'All';
}

export const FAQ_HERO_TOPIC_IDS = [
  'getting-started',
  'account',
  'payments',
  'servers',
  'privileges',
  'gameplay',
  'technical',
  'rules',
] as const satisfies readonly Exclude<FaqCategoryId, 'all'>[];

export function getHeroTopicLabel(id: (typeof FAQ_HERO_TOPIC_IDS)[number]): string {
  const category = getCategoryById(id);
  if (id === 'servers' || id === 'rules') {
    return category.mobileLabel;
  }
  return category.label;
}

export function getCategoryById(id: FaqCategoryId): FaqCategory {
  return FAQ_CATEGORIES.find(category => category.id === id) ?? FAQ_CATEGORIES[0];
}
