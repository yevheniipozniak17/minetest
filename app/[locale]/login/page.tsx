import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import LoginForm from './_sections/LoginForm/LoginForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth');
  return {
    title: t('login.meta.title'),
    description: t('login.meta.description'),
    robots: { index: false, follow: false },
  };
}

export default function LoginPage() {
  return <LoginForm />;
}
