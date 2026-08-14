import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ForgotPasswordForm from './_sections/ForgotPasswordForm/ForgotPasswordForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth');
  return {
    title: t('forgotPassword.meta.title'),
    description: t('forgotPassword.meta.description'),
    robots: { index: false, follow: false },
  };
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
