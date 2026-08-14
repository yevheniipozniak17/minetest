import type { Metadata } from 'next';
import { requireAuth } from '@/lib/server/requireAuth';
import Shop from '@/app/[locale]/store/_sections/Shop/Shop';

export const metadata: Metadata = {
  title: 'Shop — Dashboard',
  description: 'Top up crystals and upgrade your account with privileges.',
};

export default async function DashboardShopPage() {
  await requireAuth();

  return <Shop />;
}
