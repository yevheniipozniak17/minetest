import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

import styles from './Breadcrumbs.module.css';

type BreadcrumbsProps = {
  items: string[];
  links: string[];
  className?: string;
};

export async function Breadcrumbs({ items, links, className }: BreadcrumbsProps) {
  const t = await getTranslations('common');
  const classes = [styles.breadcrumbs, className].filter(Boolean).join(' ');

  if (items.length === 5) {
    const [first, second, third, fourth, fifth] = items;
    const [firstLink, secondLink, thirdLink, fourthLink] = links;

    return (
      <nav className={classes} aria-label={t('breadcrumb.ariaLabel')}>
        <Link href={firstLink}>{first}</Link> / <Link href={secondLink}>{second}</Link> /{' '}
        <Link href={thirdLink}>{third}</Link> / <Link href={fourthLink}>{fourth}</Link> /{' '}
        <span className={styles.accent}>{fifth}</span>
      </nav>
    );
  }

  const [first, second, third, fourth] = items;
  const [firstLink, secondLink, thirdLink] = links;

  if (items.length === 3) {
    return (
      <nav className={classes} aria-label={t('breadcrumb.ariaLabel')}>
        <Link href={firstLink}>{first}</Link> / <Link href={secondLink}>{second}</Link> /{' '}
        <span className={styles.accent}>{third}</span>
      </nav>
    );
  }

  return (
    <nav className={classes} aria-label={t('breadcrumb.ariaLabel')}>
      <Link href={firstLink}>{first}</Link> / <Link href={secondLink}>{second}</Link> /{' '}
      <Link href={thirdLink}>{third}</Link> /{' '}
      <span className={styles.accent}>{fourth}</span>
    </nav>
  );
}
