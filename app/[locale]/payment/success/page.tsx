import type { Metadata } from 'next';
import { Suspense } from 'react';
import PaymentResult from '@/app/[locale]/payment/_sections/PaymentResult/PaymentResult';

export const metadata: Metadata = {
  title: 'Payment Successful',
  description: 'Your payment has been completed.',
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentResult status="success" />
    </Suspense>
  );
}
