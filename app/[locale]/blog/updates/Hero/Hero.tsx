import { getTranslations } from 'next-intl/server';
import { Breadcrumbs } from '@/app/_components/Breadcrumbs/Breadcrumbs';
import { Container } from '@/app/_components/Container/Container';
import { categoryHref } from '@/app/[locale]/blog/categories';
import styles from './Hero.module.css';
import Image from 'next/image';

export default async function Hero() {
  const t = await getTranslations('blog');

  const breadcrumb = t.raw('updates.breadcrumb') as string[];
  const hero = t.raw('updates.hero') as {
    tagUpdates: string;
    tagFeatured: string;
    title: string;
    description: string;
    descriptionDesktop: string;
    date: string;
    readTime: string;
    imageAlt: string;
  };

  const breadcrumbLinks = ['/', '/blog', categoryHref('Updates')];

  return (
    <div className={styles.page}>
      <Container variant="blog">
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <Breadcrumbs items={breadcrumb} links={breadcrumbLinks} />
            <ul className={styles.tags}>
              <li>
                <span>{hero.tagUpdates}</span>
              </li>
              <li>
                <span>{hero.tagFeatured}</span>
              </li>
            </ul>
            <h1 className={styles.title}>{hero.title}</h1>

            <p className={styles.description}>{hero.description}</p>
            <p className={styles.descriptionDesktop}>{hero.descriptionDesktop}</p>

            <div className={styles.meta}>
              <span className={styles.date}>{hero.date}</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.readTime}>{hero.readTime}</span>
            </div>
          </div>

          <Image
            src="/blog/blog-featured.webp"
            alt={hero.imageAlt}
            width={375}
            height={203}
            className={`${styles.image} ${styles.imageMobile}`}
            priority
          />
          <Image
            src="/blog/update-hero-desktop.png"
            alt={hero.imageAlt}
            width={1114}
            height={603}
            className={`${styles.image} ${styles.imageDesktop}`}
            priority
          />
        </div>
      </Container>
    </div>
  );
}
