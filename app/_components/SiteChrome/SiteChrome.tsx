'use client';

import dynamic from 'next/dynamic';
import { usePathname } from '@/i18n/navigation';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { ProfileProvider } from '../ProfileProvider/ProfileProvider';
import type { UserProfile } from '@/lib/api/types';

const DashboardShell = dynamic(
  () => import('./DashboardShell').then(mod => ({ default: mod.DashboardShell })),
);

const AUTH_ROUTES = ['/register', '/login', '/forgot-password', '/verify-email', '/payment'];
const DASHBOARD_ROUTES = ['/dashboard'];

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    route => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function SiteChrome({
  children,
  isAuthed = false,
  initialProfile = null,
}: {
  children: React.ReactNode;
  isAuthed?: boolean;
  initialProfile?: UserProfile | null;
}) {
  const pathname = usePathname();

  if (matchesRoute(pathname, AUTH_ROUTES)) {
    return children;
  }

  const isDashboard = isAuthed && matchesRoute(pathname, DASHBOARD_ROUTES);

  const content = isDashboard ? (
    <DashboardShell>{children}</DashboardShell>
  ) : (
    <>
      <Header isAuthed={isAuthed} />
      <main>{children}</main>
      <Footer />
    </>
  );

  if (isAuthed) {
    return <ProfileProvider initial={initialProfile}>{content}</ProfileProvider>;
  }

  return content;
}
