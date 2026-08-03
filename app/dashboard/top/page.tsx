import type { Metadata } from 'next';
import ComingSoon from '@/app/dashboard/_sections/ComingSoon/ComingSoon';
import { requireAuth } from '@/lib/server/requireAuth';

export const metadata: Metadata = {
  title: 'Top / Ratings — Dashboard',
  description: 'Leaderboards and player rankings — launching soon.',
};

export default async function DashboardTopPage() {
  await requireAuth();

  return (
    <ComingSoon
      prefix="topRatings"
      launchAnchor="2026-07-26T23:59:59"
      heroImage="/profile/top-ratings/1.webp"
      backgroundMobile="/profile/top-ratings/bg-mobile.webp"
      backgroundDesktop="/profile/top-ratings/bg-desktop.webp"
      featureIcons={['★', '◆', '⏱']}
    />
  );
}
