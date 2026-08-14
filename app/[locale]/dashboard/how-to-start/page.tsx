import type { Metadata } from 'next';
import HowToStart from '@/app/[locale]/dashboard/_sections/HowToStart/HowToStart';
import { requireAuth } from '@/lib/server/requireAuth';

export const metadata: Metadata = {
  title: 'How to Start — Dashboard',
  description: 'Get started on the server in a few steps.',
};

export default async function DashboardHowToStartPage() {
  await requireAuth();

  return <HowToStart />;
}
