import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import VerifyEmail from './_sections/VerifyEmail/VerifyEmail';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth');
  return {
    title: t('verifyEmail.meta.title'),
    description: t('verifyEmail.meta.description'),
    robots: { index: false, follow: false },
  };
}

export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { token } = await params;
  const { email } = await searchParams;

  return <VerifyEmail token={token} email={email ?? null} />;
}
