'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import cardStyles from '../FaqAccentCard/FaqAccentCard.module.css';

export default function FaqSupportCard() {
  const t = useTranslations('faq');

  return (
    <div className={`${cardStyles.card} ${cardStyles.cardFill}`}>
      <h3 className={cardStyles.title}>{t('support.title')}</h3>
      <p className={cardStyles.description}>{t('support.desc')}</p>
      <Link href="/contacts" className={cardStyles.primaryButton}>
        {t('cta.contactUs')}
      </Link>
    </div>
  );
}
