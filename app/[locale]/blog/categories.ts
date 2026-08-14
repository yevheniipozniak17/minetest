export function buildBlogListHref(options: {
  page?: number;
  category?: string;
  searchQuery?: string;
}): string {
  const params = new URLSearchParams();
  if (options.category) params.set('category', options.category);
  if (options.searchQuery) params.set('search_query', options.searchQuery);
  if (options.page && options.page > 1) params.set('page', String(options.page));

  const qs = params.toString();
  return qs ? `/blog?${qs}` : '/blog';
}

export function categoryHref(slug?: string | null): string {
  if (!slug) return '/blog';
  return `/blog?category=${encodeURIComponent(slug)}`;
}

export function parseCategoryParam(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
