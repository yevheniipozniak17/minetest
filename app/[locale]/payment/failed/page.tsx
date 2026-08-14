import type { Metadata } from 'next';
import { Suspense } from 'react';
import PaymentResult from '@/app/[locale]/payment/_sections/PaymentResult/PaymentResult';

export const metadata: Metadata = {
  title: 'Payment Failed',
  description: 'Your payment did not go through.',
  robots: { index: false, follow: false },
};

export default function PaymentFailedPage() {
  return (
    <Suspense>
      <PaymentResult status="failed" />
    </Suspense>
  );
}
