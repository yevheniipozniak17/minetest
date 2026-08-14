'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { ClientInfoForm } from '../ClientInfoForm/ClientInfoForm';
import { PaymentMethods } from '../PaymentMethods/PaymentMethods';
import type { PaymentMethodId } from '../paymentMethods';
import {
  validateClientInfo,
  type ClientInfo,
  type ClientInfoField,
} from './clientInfo';
import styles from './CheckoutModal.module.css';

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paymentMethod: PaymentMethodId;
  onPaymentMethodChange: (id: PaymentMethodId) => void;
  clientInfo: ClientInfo;
  onClientInfoChange: (info: ClientInfo) => void;
  fieldErrors: ClientInfoField[];
  onFieldErrorsChange: (errors: ClientInfoField[]) => void;
  onClearFieldError: (field: ClientInfoField) => void;
  totalLabel: string;
  confirming?: boolean;
};

export function CheckoutModal({
  isOpen,
  onClose,
  onConfirm,
  paymentMethod,
  onPaymentMethodChange,
  clientInfo,
  onClientInfoChange,
  fieldErrors,
  onFieldErrorsChange,
  onClearFieldError,
  totalLabel,
  confirming = false,
}: CheckoutModalProps) {
  const t = useTranslations('cart');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !confirming) onClose();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, confirming]);

  function handleConfirm() {
    const missing = validateClientInfo(clientInfo);
    if (missing.length > 0) {
      onFieldErrorsChange(missing);
      return;
    }
    onConfirm();
  }

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className={styles.root}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label={t('checkoutCancel')}
        onClick={onClose}
        disabled={confirming}
      />

      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        <h2 id="checkout-modal-title" className={styles.title}>
          {t('checkoutTitle')}
        </h2>

        <section className={styles.section} aria-labelledby="checkout-payment-heading">
          <h3 id="checkout-payment-heading" className={styles.sectionTitle}>
            {t('paymentTitle')}
          </h3>
          <PaymentMethods
            value={paymentMethod}
            onChange={onPaymentMethodChange}
            variant="modal"
          />
        </section>

        <section className={styles.section} aria-labelledby="checkout-client-heading">
          <h3 id="checkout-client-heading" className={styles.sectionTitle}>
            {t('clientInfoTitle')}
          </h3>
          <ClientInfoForm
            value={clientInfo}
            onChange={onClientInfoChange}
            fieldErrors={fieldErrors}
            onClearFieldError={onClearFieldError}
            idPrefix="checkout"
            disabled={confirming}
            showValidationNote
          />
        </section>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>{t('total')}</span>
          <span className={styles.totalValue}>{totalLabel}</span>
        </div>

        <p className={styles.redirectNote}>{t('checkoutRedirectNote')}</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={confirming}
          >
            {t('checkoutCancel')}
          </button>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={confirming}
          >
            {confirming ? t('payBtnProcessing') : t('checkoutConfirm')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
