import type { ArticleCardProps } from '../CardList/Card/Card';

export type BlogArticle = ArticleCardProps & {
  slug: string;
  categoryLabel: string;
  categorySlug: string;
};

export const BLOG_ARTICLES_PER_PAGE = 6;
