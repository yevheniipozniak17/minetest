import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import RegistrationForm from './_sections/RegistrationForm/RegistrationForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth');
  return {
    title: t('register.meta.title'),
    description: t('register.meta.description'),
    robots: { index: false, follow: false },
  };
}

export default function RegisterPage() {
  return <RegistrationForm />;
}
