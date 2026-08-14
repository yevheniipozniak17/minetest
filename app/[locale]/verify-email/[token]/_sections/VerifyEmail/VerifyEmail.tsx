'use client';

import { isAxiosError } from 'axios';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { verifyEmailCode } from '@/lib/api/auth';
import styles from './VerifyEmail.module.css';

type Status = 'verifying' | 'success' | 'error' | 'needEmail';

const STORAGE_KEY = 'pending_verify_email';

function normalizeEmail(raw: string | null): string {
  if (!raw) return '';
  // у query-рядку "+" декодується як пробіл, а в email пробілів не буває — повертаємо назад
  return raw.replace(/ /g, '+').trim();
}

export default function VerifyEmail({
  token,
  email: emailFromUrl,
}: {
  token: string;
  email: string | null;
}) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [email, setEmail] = useState(() => normalizeEmail(emailFromUrl));
  const [status, setStatus] = useState<Status>('verifying');
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  const runVerify = useCallback(
    async (targetEmail: string) => {
      setStatus('verifying');
      setError(null);
      try {
        await verifyEmailCode({ email: targetEmail, email_code: token });
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        setStatus('success');
        setTimeout(() => router.push('/login'), 2200);
      } catch (err) {
        setStatus('error');
        if (isAxiosError(err)) {
          const detail = err.response?.data?.detail;
          setError(
            typeof detail === 'string'
              ? detail
              : t('verifyEmail.errorInvalid')
          );
        } else {
          setError(t('verifyEmail.errorNetwork'));
        }
      }
    },
    [router, token, t]
  );

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let resolved = email;
    if (!resolved && typeof window !== 'undefined') {
      resolved = normalizeEmail(window.localStorage.getItem(STORAGE_KEY));
    }

    if (resolved) {
      setEmail(resolved);
      runVerify(resolved);
    } else {
      setStatus('needEmail');
    }
  }, [email, runVerify]);

  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    runVerify(email.trim());
  }

  return (
    <div className={`verify-email-page ${styles.root}`}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/icons/icons/logo.webp"
            alt="Minecraft game logo"
            width={180}
            height={49}
            priority
          />
        </Link>

        {status === 'verifying' && (
          <div className={styles.block}>
            <span className={styles.spinner} aria-hidden="true" />
            <h1 className={styles.title}>{t('verifyEmail.verifyingTitle')}</h1>
            <p className={styles.text}>{t('verifyEmail.verifyingText')}</p>
          </div>
        )}

        {status === 'success' && (
          <div className={styles.block}>
            <span className={`${styles.badge} ${styles.badgeOk}`} aria-hidden="true">
              ✓
            </span>
            <h1 className={styles.title}>{t('verifyEmail.successTitle')}</h1>
            <p className={styles.text}>{t('verifyEmail.successText')}</p>
            <Link href="/login" className={styles.cta}>
              {t('verifyEmail.successCta')}
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.block}>
            <span className={`${styles.badge} ${styles.badgeError}`} aria-hidden="true">
              !
            </span>
            <h1 className={styles.title}>{t('verifyEmail.errorTitle')}</h1>
            <p className={styles.text}>{error}</p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cta}
                onClick={() => email.trim() && runVerify(email.trim())}
              >
                {t('verifyEmail.tryAgain')}
              </button>
              <Link href="/register" className={styles.secondaryLink}>
                {t('verifyEmail.backToSignUp')}
              </Link>
            </div>
          </div>
        )}

        {status === 'needEmail' && (
          <form className={styles.block} onSubmit={handleEmailSubmit} noValidate>
            <h1 className={styles.title}>{t('verifyEmail.needEmailTitle')}</h1>
            <p className={styles.text}>{t('verifyEmail.needEmailText')}</p>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={styles.input}
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
            />
            <button type="submit" className={styles.cta}>
              {t('verifyEmail.verifyButton')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
