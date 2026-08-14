import type { Metadata } from 'next';
import { requireAuth } from '@/lib/server/requireAuth';
import Settings from '@/app/[locale]/dashboard/_sections/Settings/Settings';

export const metadata: Metadata = {
  title: 'Settings — Dashboard',
  description: 'Manage profile, security, and notifications.',
};

export default async function DashboardSettingsPage() {
  await requireAuth();

  return <Settings />;
}
