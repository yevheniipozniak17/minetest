import { getTranslations } from 'next-intl/server';
import { Breadcrumbs } from '@/app/_components/Breadcrumbs/Breadcrumbs';
import { Container } from '@/app/_components/Container/Container';
import { categoryHref } from '@/app/[locale]/blog/categories';
import type { BlogPostFull } from '../types';
import styles from './Hero.module.css';

type HeroProps = Pick<
  BlogPostFull,
  | 'genre'
  | 'heroTags'
  | 'breadcrumbLabel'
  | 'title'
  | 'description'
  | 'descriptionDesktop'
  | 'date'
  | 'time'
> & {
  categoryLabel: string;
  categorySlug: string;
};

export default async function Hero({
  heroTags,
  breadcrumbLabel,
  title,
  description,
  descriptionDesktop,
  date,
  time,
  categoryLabel,
  categorySlug,
}: HeroProps) {
  const t = await getTranslations('blog');
  const breadcrumbItems = [
    t('articleHero.home'),
    t('articleHero.blog'),
    categoryLabel,
    breadcrumbLabel,
  ];
  const breadcrumbLinks = ['/', '/blog', categoryHref(categorySlug)];

  return (
    <div className={styles.page}>
      <Container variant="blog">
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <Breadcrumbs items={breadcrumbItems} links={breadcrumbLinks} />
            <ul className={styles.tags}>
              {heroTags.map(tag => (
                <li key={tag}>
                  <span>{tag}</span>
                </li>
              ))}
            </ul>
            <h1 className={styles.title}>{title}</h1>

            <p className={styles.description}>{description}</p>
            <p className={styles.descriptionDesktop}>{descriptionDesktop}</p>

            <div className={styles.meta}>
              <span className={styles.date}>{date.toString()}</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.readTime}>{t('articleHero.minRead', { time })}</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
