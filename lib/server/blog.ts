// Серверна обгортка над Blog API: типізовані функції під усі 5 ендпоінтів
// плюс окрема функція для завантаження бінарника картинки (для проксі-роута).
//
// Використовуємо нативний fetch — саме він інтегрований з кеш-системою Next
// (revalidate + теги). axios у Node не проходить через цю систему.

import 'server-only';
import { BLOG_API_URL, BLOG_AUTH_HEADER, DEFAULT_BLOG_LANG, type BlogLang } from './blogBackend';
import type {
  BlogArticle,
  BlogArticleListItem,
  BlogCategory,
  BlogListQuery,
  BlogPaginated,
} from '@/lib/api/blog-types';

const REVALIDATE_LIST = 120;
const REVALIDATE_ARTICLE = 300;
const REVALIDATE_SLUGS = 60;
const REVALIDATE_CATEGORIES = 3600;

interface FetchOpts {
  revalidate: number;
  tags: string[];
}

async function blogFetch<T>(
  path: string,
  opts: FetchOpts,
  search?: Record<string, string | number | undefined>
): Promise<T> {
  const url = new URL(`${BLOG_API_URL}${path}`);
  if (search) {
    for (const [key, value] of Object.entries(search)) {
      if (value === undefined || value === null || value === '') continue;
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(BLOG_AUTH_HEADER ? { Authorization: BLOG_AUTH_HEADER } : {}),
    },
    next: { revalidate: opts.revalidate, tags: opts.tags },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new BlogApiError(res.status, `Blog API ${path} → ${res.status}`, body);
  }
  return (await res.json()) as T;
}

export class BlogApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: string
  ) {
    super(message);
  }
}

export async function getBlogArticleList(
  query: BlogListQuery = {},
  lang: BlogLang = DEFAULT_BLOG_LANG
): Promise<BlogPaginated<BlogArticleListItem>> {
  return blogFetch<BlogPaginated<BlogArticleListItem>>(
    `/blog/${lang}/articles/list/`,
    { revalidate: REVALIDATE_LIST, tags: ['blog:list'] },
    {
      page: query.page,
      page_size: query.page_size,
      category: query.category,
      search_query: query.search_query,
    }
  );
}

export async function getBlogArticle(
  slug: string,
  lang: BlogLang = DEFAULT_BLOG_LANG
): Promise<BlogArticle | null> {
  try {
    return await blogFetch<BlogArticle>(
      `/blog/${lang}/article/${encodeURIComponent(slug)}/`,
      { revalidate: REVALIDATE_ARTICLE, tags: [`blog:article:${slug}`] }
    );
  } catch (err) {
    if (err instanceof BlogApiError && err.status === 404) return null;
    throw err;
  }
}

export async function getBlogSlugs(lang: BlogLang = DEFAULT_BLOG_LANG): Promise<string[]> {
  return blogFetch<string[]>(`/blog/${lang}/articles/slugs/`, {
    revalidate: REVALIDATE_SLUGS,
    tags: ['blog:slugs'],
  });
}

export async function getBlogCategories(
  lang: BlogLang = DEFAULT_BLOG_LANG
): Promise<BlogCategory[]> {
  const list = await blogFetch<BlogCategory[]>(`/blog/${lang}/categories/list/`, {
    revalidate: REVALIDATE_CATEGORIES,
    tags: ['blog:categories'],
  });
  // Відкидаємо биті записи (без name) — бачили один такий у списку категорій.
  return list.filter(c => typeof c.name === 'string' && c.name.trim().length > 0);
}

// Тягне бінарник картинки статті. Проксі-роут /api/blog/image/[slug] додає
// публічний Cache-Control поверх цього.
export async function fetchBlogArticleImage(
  slug: string,
  lang: BlogLang = DEFAULT_BLOG_LANG
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  const res = await fetch(
    `${BLOG_API_URL}/blog/${lang}/article/${encodeURIComponent(slug)}/image/`,
    {
      headers: BLOG_AUTH_HEADER ? { Authorization: BLOG_AUTH_HEADER } : {},
      // Кеш картинок робимо у себе на рівні відповіді, а не в fetch-кеші Next:
      // Next не кешує великі бінарники, тримати їх у ізольованому кеші зайве.
      cache: 'no-store',
    }
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new BlogApiError(res.status, `Blog image ${slug} → ${res.status}`);

  // Бекенд віддає application/octet-stream, хоча в Content-Disposition стоїть
  // filename="....webp". Нормалізуємо до image/webp за розширенням, інакше
  // next/image і браузер не розпізнають картинку як зображення.
  const rawType = res.headers.get('content-type') ?? '';
  const disposition = res.headers.get('content-disposition') ?? '';
  const contentType = normalizeImageContentType(rawType, disposition);

  return {
    buffer: await res.arrayBuffer(),
    contentType,
  };
}

function normalizeImageContentType(rawType: string, disposition: string): string {
  if (rawType.startsWith('image/')) return rawType;
  const match = /filename="[^"]*\.([a-z0-9]+)"?/i.exec(disposition);
  const ext = match?.[1]?.toLowerCase();
  switch (ext) {
    case 'webp':
      return 'image/webp';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'avif':
      return 'image/avif';
    default:
      return 'image/webp';
  }
}
