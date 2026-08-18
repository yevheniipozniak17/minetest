// Серверна обгортка над Blog API: типізовані функції під ендпоінти списку,
// статті, слагів і категорій. Картинки статей тут не фігурують — бекенд їх не
// роздає, вони лежать у public/blog/articles (див. app/[locale]/blog/_adapter).
//
// Використовуємо нативний fetch — саме він інтегрований з кеш-системою Next
// (revalidate + теги). axios у Node не проходить через цю систему.

import 'server-only';
import { getLocale } from 'next-intl/server';
import {
  BLOG_API_URL,
  BLOG_AUTH_HEADER,
  DEFAULT_BLOG_LANG,
  toBlogLang,
  type BlogLang,
} from './blogBackend';
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

// Мова блогу для поточного запиту — беремо з next-intl, тобто з URL-сегмента.
// Так вкладені серверні компоненти блогу не мусять протягувати locale пропами.
export async function currentBlogLang(): Promise<BlogLang> {
  return toBlogLang(await getLocale());
}

export async function getBlogArticleList(
  query: BlogListQuery = {},
  lang: BlogLang = DEFAULT_BLOG_LANG
): Promise<BlogPaginated<BlogArticleListItem>> {
  return blogFetch<BlogPaginated<BlogArticleListItem>>(
    `/blog/${lang}/articles/list/`,
    { revalidate: REVALIDATE_LIST, tags: ['blog:list', `blog:list:${lang}`] },
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
      {
        revalidate: REVALIDATE_ARTICLE,
        // Слаг спільний для всіх мов, тому тег без мови ревалідує статтю разом
        // з усіма перекладами — саме так контентник її й оновлює.
        tags: [`blog:article:${slug}`, `blog:article:${lang}:${slug}`],
      }
    );
  } catch (err) {
    if (err instanceof BlogApiError && err.status === 404) return null;
    throw err;
  }
}

export async function getBlogSlugs(lang: BlogLang = DEFAULT_BLOG_LANG): Promise<string[]> {
  return blogFetch<string[]>(`/blog/${lang}/articles/slugs/`, {
    revalidate: REVALIDATE_SLUGS,
    tags: ['blog:slugs', `blog:slugs:${lang}`],
  });
}

export async function getBlogCategories(
  lang: BlogLang = DEFAULT_BLOG_LANG
): Promise<BlogCategory[]> {
  const list = await blogFetch<BlogCategory[]>(`/blog/${lang}/categories/list/`, {
    revalidate: REVALIDATE_CATEGORIES,
    tags: ['blog:categories', `blog:categories:${lang}`],
  });
  // Відкидаємо биті записи (без name) — бачили один такий у списку категорій.
  return list.filter(c => typeof c.name === 'string' && c.name.trim().length > 0);
}