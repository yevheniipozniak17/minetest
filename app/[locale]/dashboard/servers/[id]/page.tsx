import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import ServerDetail from '@/app/[locale]/dashboard/_sections/ServerDetail/ServerDetail';
import { DASHBOARD_SERVERS, getDashboardServer } from '@/lib/data/dashboardServers';
import { requireAuth } from '@/lib/server/requireAuth';

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return DASHBOARD_SERVERS.map(server => ({ id: server.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const server = getDashboardServer(id);

  if (!server) {
    return { title: 'Server — Dashboard' };
  }

  const t = await getTranslations('serversData');

  return {
    title: `${server.detailTitle} — Dashboard`,
    description: t(`${server.id}.detailDescription`),
  };
}

export default async function DashboardServerDetailPage({ params }: PageProps) {
  await requireAuth();

  const { id } = await params;
  const server = getDashboardServer(id);

  if (!server) {
    notFound();
  }

  return <ServerDetail server={server} />;
}
