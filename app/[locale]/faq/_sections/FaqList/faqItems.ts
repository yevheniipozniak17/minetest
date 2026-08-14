import type { FaqCategoryId } from '../faqCategories';

export type FaqListItem = {
  id: string;
  slug: string;
  category: string;
  categoryId: Exclude<FaqCategoryId, 'all'>;
  updated: string;
  question: string;
  featured?: boolean;
  divider?: boolean;
};
