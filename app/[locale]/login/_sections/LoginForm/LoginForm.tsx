'use client';

import { isAxiosError } from 'axios';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { login } from '@/lib/api/auth';
import styles from './LoginForm.module.css';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function LoginForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError(t('login.errorEmpty'));
      return;
    }

    setStatus('submitting');
    try {
      await login({ username: email.trim(), password });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('user_email', email.trim());
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setStatus('idle');
      if (isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setFormError(typeof detail === 'string' ? detail : t('login.errorInvalid'));
      } else {
        setFormError(t('login.errorNetwork'));
      }
    }
  }

  return (
    <div className={`login-page ${styles.root}`}>
      <div className={styles.panelLeft}>
        <div className={styles.leftInner}>
          <div className={styles.topbar}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/icons/icons/logo.webp"
                alt="Minecraft game logo"
                width={215}
                height={59}
                priority
              />
            </Link>
            <Link href="/" className={styles.backLink}>
              <span className={styles.backArrow} aria-hidden="true">
                ←
              </span>
              {t('login.backToHome')}
            </Link>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.head}>
              <h1 className={styles.title}>{t('login.title')}</h1>
              <p className={styles.subtitle}>
                <span className={styles.subtitleMobile}>{t('login.subtitleMobile')}</span>
                <span className={styles.subtitleDesktop}>{t('login.subtitleDesktop')}</span>
              </p>
            </div>

            {formError && <p className={styles.formError}>{formError}</p>}

            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-email">
                {t('login.emailLabel')}
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t('login.emailPlaceholder')}
                className={styles.input}
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-password">
                {t('login.passwordLabel')}
              </label>
              <div className={styles.inputWrap}>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder={t('login.passwordPlaceholder')}
                  className={`${styles.input} ${styles.inputWithToggle}`}
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.toggle}
                  onClick={() => setShowPassword(value => !value)}
                  aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                  aria-pressed={showPassword}
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div className={styles.helperRow}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={rememberMe}
                  onChange={event => setRememberMe(event.target.checked)}
                />
                <span className={styles.checkboxBox} aria-hidden="true" />
                <span className={styles.checkboxText}>{t('login.rememberMe')}</span>
              </label>
              <Link href="/forgot-password" className={styles.forgotLink}>
                {t('login.forgotPassword')}
              </Link>
            </div>

            <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
              {status === 'submitting' ? t('login.submitting') : t('login.submit')}
            </button>

            <div className={styles.signupBlock}>
              <div className={styles.divider} role="presentation">
                <span className={styles.dividerLine} />
                <span className={styles.dividerLabel}>
                  <span className={styles.dividerLabelMobile}>{t('login.dividerMobile')}</span>
                  <span className={styles.dividerLabelDesktop}>{t('login.dividerDesktop')}</span>
                </span>
                <span className={styles.dividerLine} />
              </div>

              <p className={styles.footerLink}>
                {t('login.noAccount')}
                <Link href="/register" className={styles.createLink}>
                  {t('login.createOne')}
                </Link>
              </p>
            </div>
          </form>

          <p className={styles.helpFoot}>
            {t('login.troubleSigningIn')}{' '}
            <Link href="/contacts" className={styles.supportLink}>
              {t('login.contactSupport')}
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.panelRight}>
        <div className={styles.heroWrap}>
          <Image
            src="/auth/auth-menu.webp"
            alt="Minecraft characters in a forest landscape"
            fill
            className={styles.heroImage}
            sizes="(min-width: 1280px) 50vw, 0px"
            priority
          />
          <div className={styles.heroFade} />
        </div>

        <div className={styles.quoteCard}>
          <p className={styles.quoteText}>{t('login.panelTagline')}</p>
          <p className={styles.quoteSince}>{t('login.panelCaption')}</p>
        </div>
      </div>
    </div>
  );
}
