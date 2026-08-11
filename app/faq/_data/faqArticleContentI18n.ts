import type { FaqArticleFullContent, FaqSectionContent } from './faqArticleTypes';

type TFn = (key: string, values?: Record<string, string | number | Date>) => string;
type TRawFn = (key: string) => unknown;
type THasFn = (key: string) => boolean;

function b(mobile: string, desktop: string = mobile) {
  return { mobile, desktop };
}

/** Builds a translated FaqSectionContent for a simple article (s1/s2/s3). */
function buildSimpleSection(
  index: number,
  slug: string,
  t: TFn,
  tRaw: TRawFn,
  tHas: THasFn
): FaqSectionContent {
  const sKey = `content.${slug}.s${index}`;

  const title = t(`${sKey}.title`);
  const leadMobile = t(`${sKey}.leadMobile`);
  const leadDesktop = t(`${sKey}.leadDesktop`);

  // bullets or steps (mutually exclusive per section) — probe with tHas first,
  // because tRaw logs a MISSING_MESSAGE error for whichever key is absent.
  const rawBullets = tHas(`${sKey}.bullets`) ? tRaw(`${sKey}.bullets`) : undefined;
  const rawSteps = tHas(`${sKey}.steps`) ? tRaw(`${sKey}.steps`) : undefined;
  const rawTrailing = tHas(`${sKey}.bulletsAfterCallout`)
    ? tRaw(`${sKey}.bulletsAfterCallout`)
    : undefined;
  const bullets = Array.isArray(rawBullets) ? (rawBullets as string[]) : undefined;
  const steps = Array.isArray(rawSteps) ? (rawSteps as string[]) : undefined;
  const bulletsAfterCallout = Array.isArray(rawTrailing) ? (rawTrailing as string[]) : undefined;

  // callout (optional — only when keys exist; t() returns the key path when missing)
  let callout: FaqSectionContent['callout'] | undefined;
  if (tHas(`${sKey}.calloutTitle`) && tHas(`${sKey}.calloutMobile`)) {
    const calloutTitle = t(`${sKey}.calloutTitle`);
    const calloutMobile = t(`${sKey}.calloutMobile`);
    const calloutDesktop = tHas(`${sKey}.calloutDesktop`)
      ? t(`${sKey}.calloutDesktop`)
      : calloutMobile;
    callout = { variant: 'info', title: calloutTitle, text: b(calloutMobile, calloutDesktop) };
  }

  const sectionIndex = index - 1; // convert 1-based to 0-based for tocNum
  const tocNum = String(index).padStart(2, '0');

  return {
    id: `section-${index}`,
    tocNum,
    tocLabel: title,
    title,
    lead: b(leadMobile, leadDesktop),
    bullets: bullets ? { mobile: bullets, desktop: bullets } : undefined,
    bulletsAfterCallout: bulletsAfterCallout
      ? { mobile: bulletsAfterCallout, desktop: bulletsAfterCallout }
      : undefined,
    steps: steps ? { mobile: steps, desktop: steps } : undefined,
    callout,
  };
}

/** Builds a translated FaqArticleFullContent for simple articles (all except 'join'). */
function buildSimpleArticleContent(
  slug: string,
  t: TFn,
  tRaw: TRawFn,
  tHas: THasFn
): FaqArticleFullContent {
  const leadMobile = t(`content.${slug}.lead.mobile`);
  const leadDesktop = t(`content.${slug}.lead.desktop`);

  const sections = [1, 2, 3].map(i => buildSimpleSection(i, slug, t, tRaw, tHas));

  return {
    lead: b(leadMobile, leadDesktop),
    sections,
    sidebarRelatedSlugs: [],
    cta: {
      primary: t('contentCta.primary'),
      primaryHref: '/faq',
      secondary: t('contentCta.secondary'),
      secondaryHref: '/faq',
    },
  };
}

/** Builds the translated join article content. */
function buildJoinContent(t: TFn, tRaw: TRawFn): FaqArticleFullContent {
  function ra(key: string): string[] {
    const raw = tRaw(key);
    return Array.isArray(raw) ? (raw as string[]) : [];
  }

  function raItems(key: string): Array<{ title: string; text: string }> {
    const raw = tRaw(key);
    return Array.isArray(raw) ? (raw as Array<{ title: string; text: string }>) : [];
  }

  return {
    lead: b(t('join.lead.mobile'), t('join.lead.desktop')),
    sidebarRelatedSlugs: [
      'supported-versions',
      'reset-password',
      'connection-lost',
      'link-microsoft',
    ],
    cta: {
      primary: t('join.ctaPrimary'),
      primaryHref: 'https://www.twitch.tv/minecraftsgame',
      secondary: t('join.ctaSecondary'),
      secondaryHref: '/faq',
    },
    sections: [
      {
        id: 'before-you-start',
        tocNum: '01',
        tocLabel: t('join.beforeTitle'),
        title: t('join.beforeTitle'),
        lead: b(t('join.beforeLead.mobile'), t('join.beforeLead.desktop')),
        bullets: {
          mobile: ra('join.beforeBulletsMobile'),
          desktop: ra('join.beforeBulletsDesktop'),
        },
        callout: {
          variant: 'info',
          title: t('join.beforeCallout.title'),
          text: b(t('join.beforeCallout.mobile'), t('join.beforeCallout.desktop')),
        },
      },
      {
        id: 'create-account',
        tocNum: '02',
        tocLabel: t('join.createTitle'),
        title: t('join.createTitle'),
        lead: b(t('join.createLead.mobile'), t('join.createLead.desktop')),
        steps: { mobile: ra('join.createStepsMobile'), desktop: ra('join.createStepsDesktop') },
        figure: {
          src: '/faq/article1.webp',
          alt: 'Green Minecraft cat creating an account at a terminal',
          caption: t('join.createCaption'),
        },
      },
      {
        id: 'choose-server',
        tocNum: '03',
        tocLabel: t('join.chooseTitle'),
        title: t('join.chooseTitle'),
        lead: b(t('join.chooseLead.mobile'), t('join.chooseLead.desktop')),
        bullets: {
          mobile: ra('join.chooseBulletsMobile'),
          desktop: ra('join.chooseBulletsDesktop'),
        },
        callout: {
          variant: 'info',
          title: t('join.chooseCallout.title'),
          text: b(t('join.chooseCallout.mobile'), t('join.chooseCallout.desktop')),
        },
      },
      {
        id: 'add-server',
        tocNum: '04',
        tocLabel: t('join.addTitleMobile'),
        title: t('join.addTitleMobile'),
        titleDesktop: t('join.addTitleDesktop'),
        lead: b(t('join.addLead.mobile'), t('join.addLead.desktop')),
        steps: { mobile: ra('join.addStepsMobile'), desktop: ra('join.addStepsDesktop') },
        showIpBox: true,
      },
      {
        id: 'connect',
        tocNum: '05',
        tocLabel: t('join.connectTitle'),
        title: t('join.connectTitle'),
        lead: b(t('join.connectLead.mobile'), t('join.connectLead.desktop')),
        steps: { mobile: ra('join.connectStepsMobile'), desktop: ra('join.connectStepsDesktop') },
        figure: {
          src: '/faq/article2.webp',
          alt: 'Green Minecraft cat in the spawn lobby',
          caption: t('join.connectCaption'),
          desktopOnly: true,
        },
        callout: {
          variant: 'success',
          title: t('join.connectSuccessMobile'),
          titleDesktop: t('join.connectSuccessDesktop'),
          text: b(t('join.connectCallout.mobile'), t('join.connectCallout.desktop')),
        },
      },
      {
        id: 'troubleshooting',
        tocNum: '06',
        tocLabel: t('join.troubleTitle'),
        title: t('join.troubleTitle'),
        lead: b(t('join.troubleLead.mobile'), t('join.troubleLead.desktop')),
        troubleItems: {
          mobile: raItems('join.troubleMobileItems'),
          desktop: raItems('join.troubleDesktopItems'),
        },
      },
      {
        id: 'whats-next',
        tocNum: '07',
        tocLabel: t('join.nextTitle'),
        title: t('join.nextTitle'),
        lead: b(t('join.nextLead.mobile'), t('join.nextLead.desktop')),
        bullets: { mobile: ra('join.nextBulletsMobile'), desktop: ra('join.nextBulletsDesktop') },
      },
    ],
  };
}

/** Returns translated article content for the given slug, using the faq namespace t() function. */
export function getTranslatedFaqArticleContent(
  slug: string,
  t: TFn,
  tRaw: TRawFn,
  tHas: THasFn
): FaqArticleFullContent | undefined {
  try {
    if (slug === 'join') {
      return buildJoinContent(t, tRaw);
    }
    return buildSimpleArticleContent(slug, t, tRaw, tHas);
  } catch {
    return undefined;
  }
}
