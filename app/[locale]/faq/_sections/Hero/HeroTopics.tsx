'use client';

import { useTranslations } from 'next-intl';
import {
  FAQ_HERO_TOPIC_IDS,
  type FaqCategoryId,
} from '../faqCategories';
import { useFaqPage } from '../FaqPageContext';
import styles from './HeroTopics.module.css';

function scrollToResults() {
  requestAnimationFrame(() => {
    document.getElementById('faq-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

export default function HeroTopics() {
  const t = useTranslations('faq');
  const { activeCategory, setActiveCategory } = useFaqPage();

  const getTopicLabel = (id: Exclude<FaqCategoryId, 'all'>): string => {
    switch (id) {
      case 'getting-started': return t('categories.gettingStarted');
      case 'account':         return t('categories.account');
      case 'payments':        return t('categories.payments');
      case 'servers':         return t('categories.serversMobile');
      case 'privileges':      return t('categories.privileges');
      case 'gameplay':        return t('categories.gameplay');
      case 'technical':       return t('categories.technical');
      case 'rules':           return t('categories.rulesMobile');
    }
  };

  const selectTopic = (categoryId: FaqCategoryId) => {
    setActiveCategory(categoryId);
    scrollToResults();
  };

  return (
    <div className={styles.topics}>
      <p className={styles.label}>{t('topics.label')}</p>

      <div className={styles.tags} role="tablist" aria-label={t('topics.ariaLabel')}>
        {FAQ_HERO_TOPIC_IDS.map(categoryId => {
          const isActive = activeCategory === categoryId;

          return (
            <button
              key={categoryId}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tag} ${isActive ? styles.tagActive : ''}`}
              onClick={() => selectTopic(categoryId)}
            >
              {getTopicLabel(categoryId)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
