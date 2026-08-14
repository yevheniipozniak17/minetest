import type { Metadata } from 'next';
import { requireAuth } from '@/lib/server/requireAuth';
import Servers from '@/app/[locale]/servers/_sections/Servers/Servers';

export const metadata: Metadata = {
  title: 'Servers — Dashboard',
  description: 'Pick your world — live status and latency for every server.',
};

export default async function DashboardServersPage() {
  await requireAuth();

  return <Servers />;
}
