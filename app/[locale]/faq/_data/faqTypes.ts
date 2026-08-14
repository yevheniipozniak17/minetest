export type FaqCategoryId =
  | 'all'
  | 'getting-started'
  | 'account'
  | 'payments'
  | 'servers'
  | 'privileges'
  | 'gameplay'
  | 'technical'
  | 'rules';

export type FaqArticleCategoryId = Exclude<FaqCategoryId, 'all'>;

export type FaqSortOption = 'all' | 'latest';
