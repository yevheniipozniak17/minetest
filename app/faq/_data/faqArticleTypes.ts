export type FaqArticleContentBlock = {
  mobile: string;
  desktop: string;
};

export type FaqArticleListBlock = {
  mobile: readonly string[];
  desktop: readonly string[];
};

export type FaqSectionContent = {
  id: string;
  tocNum: string;
  tocLabel: string;
  title: string;
  titleDesktop?: string;
  lead: FaqArticleContentBlock;
  bullets?: FaqArticleListBlock;
  /** Rendered after the callout, so a note can sit between two groups of bullets. */
  bulletsAfterCallout?: FaqArticleListBlock;
  steps?: FaqArticleListBlock;
  callout?: {
    variant: 'info' | 'success';
    title: string;
    titleDesktop?: string;
    text: FaqArticleContentBlock;
  };
  figure?: {
    src: string;
    alt: string;
    caption?: string;
    desktopOnly?: boolean;
  };
  troubleItems?: {
    mobile: readonly { title: string; text: string }[];
    desktop: readonly { title: string; text: string }[];
  };
  showIpBox?: boolean;
};

export type FaqArticleFullContent = {
  lead: FaqArticleContentBlock;
  sections: readonly FaqSectionContent[];
  sidebarRelatedSlugs: readonly string[];
  cta?: {
    primary: string;
    primaryHref: string;
    secondary: string;
    secondaryHref: string;
  };
};
