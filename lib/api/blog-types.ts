// Типи під реальний JSON API блогу (deprod.top). Свагер декларує `translations`,
// але реальний бекенд віддає рівні поля title/short_description і т.д. — саме
// їх і використовуємо. Наявність block-структури дає можливість у майбутньому
// розбивати статтю на секції з окремими картинками.

export interface BlogArticleBlock {
  index: number;
  text: string;
  image: string | null;
}

export interface BlogArticleListItem {
  slug: string;
  category_slug: string;
  title: string;
  short_description: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string | null;
  reading_time: number; // Хвилини. Бекенд рахує на основі word_count статті.
  image: string; // Повний URL до /image/ ендпоінта (з авторизацією).
  publish_date: string;
  cluster_id: string | null;
}

export interface BlogArticle extends BlogArticleListItem {
  blocks: BlogArticleBlock[];
}

export interface BlogCategory {
  slug: string;
  name?: string; // На бекенді трапляються записи без name — обробляємо як edge-case.
}

export interface BlogPaginated<T> {
  count: number;
  pages?: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BlogListQuery {
  page?: number;
  page_size?: number;
  category?: string;
  search_query?: string;
}
