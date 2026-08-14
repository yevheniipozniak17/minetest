import type { ArticleCardProps } from '../CardList/Card/Card';

export type ResponsiveText = {
  mobile: string;
  desktop?: string;
};

export type ArticleBlock =
  | { type: 'paragraph'; text: ResponsiveText }
  | { type: 'bullets'; items: readonly string[]; desktopItems?: readonly string[] }
  | { type: 'ordered'; items: readonly string[]; desktopItems?: readonly string[] }
  | { type: 'subheading'; text: string }
  | {
      type: 'figure';
      src: string;
      alt: string;
      caption: string;
      dashed?: boolean;
    }
  | {
      type: 'callout';
      variant: 'info' | 'warn';
      title: string;
      text: ResponsiveText;
    }
  | { type: 'quote'; text: ResponsiveText; author: string }
  | {
      type: 'cta';
      primary: string;
      secondaryLabel: string;
      secondaryHref: string;
    };

export type ArticleSection = {
  id: string;
  tocLabel: string;
  title: string;
  blocks: readonly ArticleBlock[];
};

export type BlogPostFull = ArticleCardProps & {
  slug: string;
  popularity: number;
  heroTags: readonly string[];
  sidebarTags: readonly string[];
  breadcrumbLabel: string;
  descriptionDesktop: string;
  heroImageDesktop?: string;
  lead: ResponsiveText;
  sections: readonly ArticleSection[];
};
