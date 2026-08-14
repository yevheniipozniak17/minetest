import type { Metadata } from 'next';
import ComingSoon from '@/app/[locale]/dashboard/_sections/ComingSoon/ComingSoon';
import { requireAuth } from '@/lib/server/requireAuth';

export const metadata: Metadata = {
  title: 'Tournaments — Dashboard',
  description: 'Competitive tournaments with prize pools — launching soon.',
};

export default async function DashboardTournamentsPage() {
  await requireAuth();

  return (
    <ComingSoon
      prefix="tournaments"
      launchAnchor="2026-07-26T23:59:59"
      heroImage="/profile/tournaments/1.webp"
      backgroundMobile="/profile/tournaments/img-mobile.webp"
      backgroundDesktop="/profile/tournaments/img-desktop.webp"
      featureIcons={['♛', '◆', '⚔']}
    />
  );
}
