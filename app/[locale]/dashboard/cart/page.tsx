import type { Metadata } from 'next';
import { requireAuth } from '@/lib/server/requireAuth';
import Cart from '@/app/[locale]/dashboard/_sections/Cart/Cart';

export const metadata: Metadata = {
  title: 'Cart — Dashboard',
  description: 'Review items before checkout.',
};

export default async function DashboardCartPage() {
  await requireAuth();

  return <Cart />;
}
