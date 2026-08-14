'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FAQ_CATEGORIES, FAQ_MOST_ASKED, type FaqCategoryId } from '../faqCategories';
import { getCategoryTranslationKey } from '../categoryTranslationKeys';
import FaqSupportCard from '../FaqSupportCard/FaqSupportCard';
import styles from './FaqSidebar.module.css';

type FaqSidebarProps = {
  activeCategory: FaqCategoryId;
  onCategoryChange: (category: FaqCategoryId) => void;
};

export default function FaqSidebar({ activeCategory, onCategoryChange }: FaqSidebarProps) {
  const t = useTranslations('faq');

  return (
    <aside className={styles.sidebar} aria-label={t('sidebar.ariaLabel')}>
      <div className={styles.categoriesCard}>
        <h2 className={styles.cardTitle}>{t('sidebar.browseByTopic')}</h2>
        <ul className={styles.categoryList}>
          {FAQ_CATEGORIES.map(category => {
            const isActive = category.id === activeCategory;

            return (
              <li key={category.id}>
                <button
                  type="button"
                  className={`${styles.categoryItem} ${isActive ? styles.categoryItemActive : ''}`}
                  aria-pressed={isActive}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <span className={styles.categoryLabel}>
                    {t(getCategoryTranslationKey(category.id, 'full'))}
                  </span>
                  <span className={styles.categoryCount}>{category.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.popularCard}>
        <h2 className={styles.cardTitle}>{t('sidebar.mostAsked')}</h2>
        <ul className={styles.popularList}>
          {FAQ_MOST_ASKED.map(item => (
            <li key={item.num} className={styles.popularItem}>
              <span className={styles.popularNum}>{item.num}</span>
              <Link href={`/faq/${item.slug}`} className={styles.popularQuestion}>
                {t(`mostAsked.${item.num}` as Parameters<typeof t>[0])}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <FaqSupportCard />
    </aside>
  );
}
