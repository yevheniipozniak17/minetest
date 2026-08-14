import type { Metadata } from 'next';
import { requireAuth } from '@/lib/server/requireAuth';
import Dashboard from './_sections/Dashboard/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personal hub: servers, balance and quick actions.',
};

export default async function DashboardPage() {
  await requireAuth();

  return <Dashboard />;
}
