import type { FaqCategoryId } from './faqCategories';

type LabelVariant = 'full' | 'mobile';

/** Returns the next-intl key (within the 'faq' namespace) for a category label. */
export function getCategoryTranslationKey(
  id: FaqCategoryId,
  variant: LabelVariant = 'full',
): string {
  if (id === 'all') {
    return variant === 'mobile' ? 'categories.allMobile' : 'categories.all';
  }
  const map: Record<Exclude<FaqCategoryId, 'all'>, { full: string; mobile: string }> = {
    'getting-started': { full: 'categories.gettingStarted', mobile: 'categories.gettingStarted' },
    account:           { full: 'categories.account',        mobile: 'categories.accountMobile' },
    payments:          { full: 'categories.payments',       mobile: 'categories.payments' },
    servers:           { full: 'categories.servers',        mobile: 'categories.serversMobile' },
    privileges:        { full: 'categories.privileges',     mobile: 'categories.privileges' },
    gameplay:          { full: 'categories.gameplay',       mobile: 'categories.gameplay' },
    technical:         { full: 'categories.technical',      mobile: 'categories.technical' },
    rules:             { full: 'categories.rules',          mobile: 'categories.rulesMobile' },
  };
  return map[id as Exclude<FaqCategoryId, 'all'>][variant];
}
