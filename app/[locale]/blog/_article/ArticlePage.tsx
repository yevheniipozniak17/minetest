import Hero from './Hero/Hero';
import HtmlArticleBody from './Articles/HtmlArticleBody';
import Related from './Related/Related';
import type { AdaptedFullArticle } from '../_adapter';
import type { ArticleCardProps } from '../CardList/Card/Card';

type ArticlePageProps = {
  post: AdaptedFullArticle;
  sanitizedHtml: string;
  relatedArticles: ArticleCardProps[];
};

export default function ArticlePage({ post, sanitizedHtml, relatedArticles }: ArticlePageProps) {
  return (
    <>
      <Hero
        genre={post.genre}
        heroTags={post.heroTags}
        breadcrumbLabel={post.breadcrumbLabel}
        title={post.title}
        description={post.description}
        descriptionDesktop={post.descriptionDesktop}
        date={post.date}
        time={post.time}
        categoryLabel={post.categoryLabel}
        categorySlug={post.categorySlug}
      />
      <HtmlArticleBody
        title={post.title}
        lead={post.lead.mobile}
        sanitizedHtml={sanitizedHtml}
        tocItems={post.tocItems}
        sidebarTags={post.sidebarTags}
        heroImage={post.image}
      />
      <Related articles={relatedArticles} desktopArticles={relatedArticles} />
    </>
  );
}
