import { TWITCH_URL } from '@/lib/data/social';

export const NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'servers', href: '/servers' },
  { key: 'store', href: '/store' },
  { key: 'howToStart', href: '/how-to-start' },
  { key: 'blog', href: '/blog' },
  { key: 'about', href: '/about' },
  { key: 'faq', href: '/faq' },
] as const;

export type NavLinkKey = (typeof NAV_LINKS)[number]['key'];

export function isNavLinkActive(href: string, pathname: string) {
  if (href === '/') return pathname === '/';
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const SOCIAL_LINKS = [
  { icon: '/icons/social/prime_twitter.svg', alt: 'Twitter', href: 'https://x.com/Minecrafts_Game', size: 18 },
  { icon: '/icons/social/twitch.svg', alt: 'Twitch', href: TWITCH_URL, size: 18 },
  { icon: '/icons/social/ic_round-facebook.svg', alt: 'Facebook', href: 'https://www.facebook.com/minecraftsgameworld', size: 18 },
  { icon: '/icons/social/ri_instagram-fill.svg', alt: 'Instagram', href: 'https://www.instagram.com/minecraftsgameworld', size: 18 },
] as const;

const LEGAL_LINKS = [
  { key: 'privacy', href: '/privacy-policy' },
  { key: 'terms', href: '/terms' },
  { key: 'cookies', href: '/cookie-policy' },
] as const;

export type LegalLinkKey = (typeof LEGAL_LINKS)[number]['key'];

export { LEGAL_LINKS, SOCIAL_LINKS };
