'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { notifyPurchaseSuccess } from '@/lib/client/purchaseNotification';
import { clearPendingPayment, clearPaymentReturnFlag } from '@/lib/client/pendingPayment';
import styles from './PaymentResult.module.css';

type Status = 'success' | 'failed';

const HREFS: Record<Status, { primary: string; secondary: string }> = {
  success: {
    primary: '/dashboard',
    secondary: '/dashboard/history',
  },
  failed: {
    primary: '/dashboard/cart',
    secondary: '/dashboard/shop',
  },
};

export default function PaymentResult({ status }: { status: Status }) {
  const t = useTranslations('system');
  const params = useSearchParams();
  // Провайдер часто додає референс платежу в query — показуємо, якщо є.
  // Тримаємо широкий перелік імен, бо різні шлюзи називають поле по-різному.
  const orderRef =
    params.get('order') ??
    params.get('order_id') ??
    params.get('id') ??
    params.get('payment_id') ??
    params.get('transaction_id') ??
    params.get('transaction') ??
    params.get('txn_id') ??
    params.get('invoice') ??
    params.get('bill') ??
    params.get('reference') ??
    params.get('ref');

  const hrefs = HREFS[status];

  useEffect(() => {
    // Провайдер завершив потік (успіх або відмова) — прибираємо збережений лінк,
    // щоб у кошику не висів банер «Продовжити оплату», і скидаємо прапорець reload.
    clearPendingPayment();
    clearPaymentReturnFlag();
    if (status === 'success') notifyPurchaseSuccess();
  }, [status]);

  return (
    <div className={`${styles.root} ${styles[status]}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/icons/icons/logo.webp"
            alt={t('payment_logoAlt')}
            width={200}
            height={55}
            priority
          />
        </Link>

        <div className={styles.card}>
          <span className={styles.icon} aria-hidden="true">
            {status === 'success' ? '✓' : '×'}
          </span>

          <span className={styles.eyebrow}>
            {status === 'success' ? t('payment_successEyebrow') : t('payment_failedEyebrow')}
          </span>
          <h1 className={styles.title}>
            {status === 'success' ? t('payment_successTitle') : t('payment_failedTitle')}
          </h1>
          <p className={styles.subtitle}>
            {status === 'success' ? t('payment_successSubtitle') : t('payment_failedSubtitle')}
          </p>

          {orderRef && (
            <p className={styles.orderRef}>
              {t('payment_reference')} <span className={styles.orderRefValue}>{orderRef}</span>
            </p>
          )}

          <div className={styles.actions}>
            <Link href={hrefs.primary} className={styles.primaryBtn}>
              {status === 'success' ? t('payment_successPrimary') : t('payment_failedPrimary')}
            </Link>
            <Link href={hrefs.secondary} className={styles.secondaryBtn}>
              {status === 'success' ? t('payment_successSecondary') : t('payment_failedSecondary')}
            </Link>
          </div>
        </div>

        <p className={styles.help}>
          {t('payment_helpText')}{' '}
          <Link href="/faq" className={styles.helpLink}>
            {t('payment_helpLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
