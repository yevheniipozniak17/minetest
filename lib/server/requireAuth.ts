import { redirect } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';
import { getRefreshToken } from './authCookies';

export async function requireAuth() {
  const refresh = await getRefreshToken();

  if (!refresh) {
    const locale = await getLocale();
    redirect({ href: '/login', locale });
  }
}
