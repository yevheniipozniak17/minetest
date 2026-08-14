import type { Metadata } from 'next';
import Hero from './_sections/Hero/Hero';
import ContactChannels from './_sections/ContactChannels/ContactChannels';
import styles from './page.module.css';
import { buildMetadata, localeFromParams } from '@/lib/seo/meta';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: localeFromParams(locale),
    title: 'Contacts',
    description:
      'Reach our support team by email, form, or social. We are here to help with account, billing, and gameplay questions.',
    path: '/contacts',
  });
}

export default function ContactsPage() {
  return (
    <main className={styles.page}>
      <Hero />
      <ContactChannels />
    </main>
  );
}
