'use client';

import { isAxiosError } from 'axios';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { restorePassword, changePassword } from '@/lib/api/auth';
import styles from './ForgotPasswordForm.module.css';

function errorText(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    return fallback;
  }
  return 'network';
}

export default function ForgotPasswordForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [tmpPassword, setTmpPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const expectItems = [
    t('forgotPassword.expect1'),
    t('forgotPassword.expect2'),
    t('forgotPassword.expect3'),
  ];

  async function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!email.trim()) {
      setError(t('forgotPassword.errorEmpty'));
      return;
    }

    setStatus('submitting');
    try {
      await restorePassword({ email: email.trim() });
      setStep('reset');
      setNotice(t('forgotPassword.noticeEmailSent'));
    } catch (err) {
      const raw = errorText(err, t('forgotPassword.errorSendFail'));
      setError(raw === 'network' ? t('forgotPassword.errorNetwork') : raw);
    } finally {
      setStatus('idle');
    }
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!tmpPassword || !newPassword) {
      setError(t('forgotPassword.errorTmpRequired'));
      return;
    }
    if (newPassword.length < 4 || newPassword.length > 24) {
      setError(t('forgotPassword.errorNewPasswordLength'));
      return;
    }

    setStatus('submitting');
    try {
      await changePassword({
        email: email.trim(),
        tmp_password: tmpPassword,
        new_password: newPassword,
      });
      router.push('/login');
    } catch (err) {
      const raw = errorText(err, t('forgotPassword.errorChangeFail'));
      setError(raw === 'network' ? t('forgotPassword.errorNetwork') : raw);
      setStatus('idle');
    }
  }

  return (
    <div className={`forgot-password-page ${styles.root}`}>
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
              {t('forgotPassword.backToHome')}
            </Link>
          </div>

          {step === 'request' ? (
            <form className={styles.form} onSubmit={handleRequest} noValidate>
              <div className={styles.head}>
                <h1 className={styles.title}>{t('forgotPassword.requestTitle')}</h1>
                <p className={styles.subtitle}>
                  <span className={styles.subtitleMobile}>
                    {t('forgotPassword.requestSubtitleMobile')}
                  </span>
                  <span className={styles.subtitleDesktop}>
                    {t('forgotPassword.requestSubtitleDesktop')}
                  </span>
                </p>
              </div>

              {error && <p className={styles.formError}>{error}</p>}
              {notice && <p className={styles.help}>{notice}</p>}

              <div className={styles.field}>
                <label className={styles.label} htmlFor="forgot-email">
                  {t('forgotPassword.emailLabel')}
                </label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('forgotPassword.emailPlaceholder')}
                  className={styles.input}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <p className={styles.help}>
                  <span className={styles.helpMobile}>{t('forgotPassword.helpMobile')}</span>
                  <span className={styles.helpDesktop}>{t('forgotPassword.helpDesktop')}</span>
                </p>
              </div>

              <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
                {status === 'submitting' ? t('forgotPassword.submitting') : t('forgotPassword.submit')}
              </button>

              <div className={styles.loginBlock}>
                <div className={styles.divider} role="presentation">
                  <span className={styles.dividerLine} />
                  <span className={styles.dividerLabel}>{t('forgotPassword.divider')}</span>
                  <span className={styles.dividerLine} />
                </div>

                <p className={styles.footerLink}>
                  <span>{t('forgotPassword.alreadyHaveCode')}</span>
                  <button
                    type="button"
                    className={styles.loginLink}
                    onClick={() => {
                      setError(null);
                      setStep('reset');
                    }}
                  >
                    {t('forgotPassword.enterIt')}
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleReset} noValidate>
              <div className={styles.head}>
                <h1 className={styles.title}>{t('forgotPassword.resetTitle')}</h1>
                <p className={styles.subtitle}>
                  <span className={styles.subtitleMobile}>
                    {t('forgotPassword.resetSubtitleMobile')}
                  </span>
                  <span className={styles.subtitleDesktop}>
                    {t('forgotPassword.resetSubtitleDesktop')}
                  </span>
                </p>
              </div>

              {error && <p className={styles.formError}>{error}</p>}
              {notice && <p className={styles.help}>{notice}</p>}

              <div className={styles.field}>
                <label className={styles.label} htmlFor="reset-email">
                  {t('forgotPassword.emailLabel')}
                </label>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('forgotPassword.emailPlaceholder')}
                  className={styles.input}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="reset-tmp">
                  {t('forgotPassword.tmpPasswordLabel')}
                </label>
                <input
                  id="reset-tmp"
                  name="tmp_password"
                  type="text"
                  autoComplete="one-time-code"
                  placeholder={t('forgotPassword.tmpPasswordPlaceholder')}
                  className={styles.input}
                  value={tmpPassword}
                  onChange={e => setTmpPassword(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="reset-new">
                  {t('forgotPassword.newPasswordLabel')}
                </label>
                <input
                  id="reset-new"
                  name="new_password"
                  type="password"
                  autoComplete="new-password"
                  placeholder={t('forgotPassword.newPasswordPlaceholder')}
                  className={styles.input}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
                {status === 'submitting' ? t('forgotPassword.saving') : t('forgotPassword.save')}
              </button>

              <div className={styles.loginBlock}>
                <div className={styles.divider} role="presentation">
                  <span className={styles.dividerLine} />
                  <span className={styles.dividerLabel}>{t('forgotPassword.divider')}</span>
                  <span className={styles.dividerLine} />
                </div>

                <p className={styles.footerLink}>
                  <span>{t('forgotPassword.needNewEmail')}</span>
                  <button
                    type="button"
                    className={styles.loginLink}
                    onClick={() => {
                      setError(null);
                      setNotice(null);
                      setStep('request');
                    }}
                  >
                    {t('forgotPassword.requestAgain')}
                  </button>
                </p>
              </div>
            </form>
          )}

          <p className={styles.helpFoot}>
            {t('forgotPassword.cantAccess')}{' '}
            <Link href="/contacts" className={styles.supportLink}>
              {t('forgotPassword.contactSupport')}
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

        <div className={styles.reassureCard}>
          <p className={styles.reassureTitle}>{t('forgotPassword.expectTitle')}</p>
          <ul className={styles.reassureList}>
            {expectItems.map(item => (
              <li key={item} className={styles.reassureItem}>
                <span className={styles.reassureDot} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
