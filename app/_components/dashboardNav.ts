import type { CSSProperties } from 'react';

export type WorkspaceLink = {
  key: string;
  href: string;
  icon: string;
  badge?: number;
  soon?: boolean;
};

export const WORKSPACE_LINKS: WorkspaceLink[] = [
  { key: 'dashboard', href: '/dashboard', icon: 'home-2-outline' },
  { key: 'shop', href: '/dashboard/shop', icon: 'shop-minimalistic-outline' },
  { key: 'servers', href: '/dashboard/servers', icon: 'server-2-outline' },
  { key: 'cart', href: '/dashboard/cart', icon: 'cart-large-minimalistic-outline' },
  { key: 'history', href: '/dashboard/history', icon: 'history-outline' },
  { key: 'top', href: '/dashboard/top', icon: 'bill-check-outline', soon: true },
  { key: 'tournaments', href: '/dashboard/tournaments', icon: 'cup-first-outline', soon: true },
  { key: 'howToStart', href: '/dashboard/how-to-start', icon: 'flag-2-outline' },
];

export function dashboardIconStyle(name: string): CSSProperties {
  const url = `url("/icons/dashboard/${name}.svg")`;
  return { maskImage: url, WebkitMaskImage: url };
}
