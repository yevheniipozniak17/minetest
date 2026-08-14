import type { BlogArticle, BlogArticleListItem } from '@/lib/api/blog-types';
import type { ArticleCardProps } from './CardList/Card/Card';

export type CategoryMap = Map<string, string>;

export type TocItem = {
  id: string;
  label: string;
};

export type AdaptedCardArticle = ArticleCardProps & {
  slug: string;
  categoryLabel: string;
  categorySlug: string;
};

export type AdaptedFullArticle = AdaptedCardArticle & {
  htmlContent: string;
  htmlWithAnchors: string;
  tocItems: TocItem[];
  heroTags: readonly string[];
  sidebarTags: readonly string[];
  breadcrumbLabel: string;
  descriptionDesktop: string;
  heroImageDesktop: string;
  lead: { mobile: string; desktop?: string };
};

// Фолбек на випадок, якщо бекенд у якомусь записі не порахує reading_time.
const READING_TIME_FALLBACK = 1;

export function buildCategoryMap(
  categories: { slug: string; name?: string }[]
): CategoryMap {
  return new Map(
    categories
      .filter(c => c.slug && c.name)
      .map(c => [c.slug, c.name as string])
  );
}

export function categoryLabelFor(
  categorySlug: string,
  categoryMap: CategoryMap
): string {
  return categoryMap.get(categorySlug) ?? formatSlugLabel(categorySlug);
}

function formatSlugLabel(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatArticleDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function blogImagePath(slug: string): string {
  return `/api/blog/image/${slug}`;
}

export function slugifyHeading(text: string): string {
  const base = stripHtml(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return base || 'section';
}

export function extractTocItems(html: string): TocItem[] {
  const items: TocItem[] = [];
  const seen = new Set<string>();
  const regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const label = stripHtml(match[1] ?? '');
    if (!label) continue;

    let id = slugifyHeading(label);
    let suffix = 2;
    while (seen.has(id)) {
      id = `${slugifyHeading(label)}-${suffix}`;
      suffix += 1;
    }
    seen.add(id);
    items.push({ id, label });
  }

  return items;
}

export function injectHeadingAnchors(html: string, tocItems: TocItem[]): string {
  let index = 0;
  return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (full, attrs, inner) => {
    const item = tocItems[index];
    index += 1;
    if (!item) return full;

    const attrsString = String(attrs ?? '');
    if (/\sid=/.test(attrsString)) {
      return `<h2${attrsString}>${inner}</h2>`;
    }

    return `<h2 id="section-${item.id}"${attrsString}>${inner}</h2>`;
  });
}

export function adaptCardArticle(
  item: BlogArticleListItem,
  categoryMap: CategoryMap
): AdaptedCardArticle {
  const categoryLabel = categoryLabelFor(item.category_slug, categoryMap);
  const time = Number.isFinite(item.reading_time) && item.reading_time > 0
    ? item.reading_time
    : READING_TIME_FALLBACK;

  return {
    slug: item.slug,
    image: blogImagePath(item.slug),
    genre: 'Guides',
    time,
    title: item.title,
    description: item.short_description,
    date: formatArticleDate(item.publish_date),
    categoryLabel,
    categorySlug: item.category_slug,
  };
}

export function adaptFullArticle(
  article: BlogArticle,
  categoryMap: CategoryMap
): AdaptedFullArticle {
  const htmlContent = article.blocks?.[0]?.text ?? '';
  const tocItems = extractTocItems(htmlContent);
  const htmlWithAnchors = injectHeadingAnchors(htmlContent, tocItems);
  const categoryLabel = categoryLabelFor(article.category_slug, categoryMap);
  const card = adaptCardArticle(article, categoryMap);

  return {
    ...card,
    htmlContent,
    htmlWithAnchors,
    tocItems,
    heroTags: [categoryLabel],
    sidebarTags: [categoryLabel],
    breadcrumbLabel: article.title,
    descriptionDesktop: article.short_description,
    heroImageDesktop: blogImagePath(article.slug),
    lead: { mobile: article.short_description },
  };
}
