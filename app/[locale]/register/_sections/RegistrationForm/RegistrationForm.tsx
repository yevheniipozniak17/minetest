'use client';

import { isAxiosError } from 'axios';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { register as registerUser, sendEmailCode } from '@/lib/api/auth';
import { initSeon, getSeonSession } from '@/lib/client/seon';
import styles from './RegistrationForm.module.css';

type FieldErrors = Partial<Record<'email' | 'password', string>>;

function mapApiErrors(data: unknown): { fields: FieldErrors; general: string | null } {
  const fields: FieldErrors = {};
  let general: string | null = null;

  if (typeof data === 'string') {
    return { fields, general: data };
  }

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    (['email', 'password'] as const).forEach(key => {
      const value = obj[key];
      if (Array.isArray(value) && value.length) fields[key] = String(value[0]);
      else if (typeof value === 'string') fields[key] = value;
    });
    if (typeof obj.detail === 'string') general = obj.detail;
  }

  return { fields, general };
}

type StrengthKey = 'weak' | 'fair' | 'okay' | 'strong';

type PasswordStrength = {
  filledBars: number;
  key: StrengthKey;
  color: string;
};

function getPasswordStrength(password: string): PasswordStrength | null {
  if (!password) return null;

  let points = 0;
  if (password.length >= 8) points++;
  if (/[0-9]/.test(password)) points++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
  if (/[^a-zA-Z0-9]/.test(password)) points++;

  if (points <= 1) return { filledBars: 1, key: 'weak', color: '#ff6b6b' };
  if (points === 2) return { filledBars: 2, key: 'fair', color: '#ffb347' };
  if (points === 3) return { filledBars: 3, key: 'okay', color: '#ffb347' };
  return { filledBars: 4, key: 'strong', color: '#bde153' };
}

const STRENGTH_KEY_TO_LABEL: Record<StrengthKey, string> = {
  weak: 'register.strengthWeak',
  fair: 'register.strengthFair',
  okay: 'register.strengthOkay',
  strong: 'register.strengthStrong',
};

const STRENGTH_KEY_TO_HINT: Record<StrengthKey, string> = {
  weak: 'register.strengthWeakHint',
  fair: 'register.strengthFairHint',
  okay: 'register.strengthOkayHint',
  strong: 'register.strengthStrongHint',
};

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

export default function RegistrationForm() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const STATS = [
    { value: 'FREE', label: t('register.statFreeToJoin') },
    { value: '4.8', label: t('register.statPlayerSatisfaction') },
    { value: '3', label: t('register.statLiveServers') },
  ];

  useEffect(() => {
    // Стартуємо SEON-агент на відкритті форми (поведінковий аналіз для антифроду).
    initSeon();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const errors: FieldErrors = {};
    if (!email.trim()) errors.email = t('register.errorEmailRequired');
    if (password.length < 4 || password.length > 24) {
      errors.password = t('register.errorPasswordLength');
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    if (confirmPassword !== password) {
      setFormError(t('register.errorPasswordMatch'));
      return;
    }
    if (!agreed) {
      setFormError(t('register.errorTerms'));
      return;
    }

    setStatus('submitting');
    try {
      const seonSession = await getSeonSession();
      await registerUser({ password, email: email.trim(), seonSession });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('pending_verify_email', email.trim());
      }
      try {
        await sendEmailCode({ email: email.trim() });
      } catch {
        // лист можна перевідправити з екрана успіху
      }
      setStatus('success');
    } catch (err) {
      setStatus('idle');
      if (isAxiosError(err)) {
        const { fields, general } = mapApiErrors(err.response?.data);
        setFieldErrors(fields);
        setFormError(general ?? t('register.errorGeneral'));
      } else {
        setFormError(t('register.errorNetwork'));
      }
    }
  }

  async function handleResend() {
    setResending(true);
    setResent(false);
    try {
      await sendEmailCode({ email: email.trim() });
      setResent(true);
    } catch {
      setFormError(t('register.errorResend'));
    } finally {
      setResending(false);
    }
  }

  return (
    <div className={`register-page ${styles.root}`}>
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
              {t('register.backToHome')}
            </Link>
          </div>

          {status === 'success' ? (
            <div className={styles.success}>
              <div className={styles.head}>
                <h1 className={styles.title}>{t('register.successTitle')}</h1>
                <p className={styles.subtitle}>
                  {t('register.successSubtitle', { email })}
                </p>
              </div>

              {formError && <p className={styles.formError}>{formError}</p>}

              <Link href="/login" className={styles.successCta}>
                {t('register.successCta')}
              </Link>

              <p className={styles.footerLink}>
                <span>{t('register.didntGet')}</span>
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? t('register.sending') : resent ? t('register.sentAgain') : t('register.resendEmail')}
                </button>
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.head}>
                <h1 className={styles.title}>{t('register.title')}</h1>
                <p className={styles.subtitle}>
                  <span className={styles.subtitleMobile}>{t('register.subtitleMobile')}</span>
                  <span className={styles.subtitleDesktop}>{t('register.subtitleDesktop')}</span>
                </p>
              </div>

              {formError && <p className={styles.formError}>{formError}</p>}

              <div className={styles.field}>
                <label className={styles.label} htmlFor="register-email">
                  {t('register.emailLabel')}
                </label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('register.emailPlaceholder')}
                  className={[styles.input, fieldErrors.email && styles.inputError]
                    .filter(Boolean)
                    .join(' ')}
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  required
                />
                {fieldErrors.email && (
                  <p className={styles.fieldError}>{fieldErrors.email}</p>
                )}
              </div>

              <div className={styles.passwordField}>
                <label className={styles.label} htmlFor="register-password">
                  {t('register.passwordLabel')}
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={t('register.passwordPlaceholder')}
                    className={[
                      styles.input,
                      styles.inputWithToggle,
                      password && styles.inputFilled,
                      fieldErrors.password && styles.inputError,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    minLength={4}
                    maxLength={24}
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.toggle}
                    onClick={() => setShowPassword(value => !value)}
                    aria-label={showPassword ? t('register.hidePassword') : t('register.showPassword')}
                    aria-pressed={showPassword}
                    tabIndex={-1}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className={styles.fieldError}>{fieldErrors.password}</p>
                )}

                {passwordStrength && (
                  <div className={styles.strength} aria-live="polite">
                    <div className={styles.strengthBars}>
                      {Array.from({ length: 4 }, (_, index) => (
                        <span
                          key={index}
                          className={styles.strengthBar}
                          style={{
                            background:
                              index < passwordStrength.filledBars
                                ? passwordStrength.color
                                : 'rgba(255, 255, 255, 0.08)',
                          }}
                        />
                      ))}
                    </div>
                    <div className={styles.strengthMeta}>
                      <span
                        className={styles.strengthLabel}
                        style={{ color: passwordStrength.color }}
                      >
                        {t(STRENGTH_KEY_TO_LABEL[passwordStrength.key])}
                      </span>
                      <span className={styles.strengthHint}>
                        {t(STRENGTH_KEY_TO_HINT[passwordStrength.key])}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="register-confirm-password">
                  {t('register.confirmPasswordLabel')}
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={t('register.confirmPasswordPlaceholder')}
                    className={`${styles.input} ${styles.inputWithToggle}`}
                    minLength={4}
                    maxLength={24}
                    value={confirmPassword}
                    onChange={event => setConfirmPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.toggle}
                    onClick={() => setShowConfirm(value => !value)}
                    aria-label={showConfirm ? t('register.hidePassword') : t('register.showPassword')}
                    aria-pressed={showConfirm}
                    tabIndex={-1}
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
              </div>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={agreed}
                  onChange={event => setAgreed(event.target.checked)}
                  required
                />
                <span className={styles.checkboxBox} aria-hidden="true" />
                <span className={styles.checkboxText}>
                  {t('register.agreeTermsPrefix')}{' '}
                  <Link href="/terms" className={styles.checkboxLink}>
                    {t('register.termsOfService')}
                  </Link>{' '}
                  {t('register.agreeTermsAnd')}{' '}
                  <Link href="/privacy-policy" className={styles.checkboxLink}>
                    {t('register.privacyPolicy')}
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                className={styles.submit}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? t('register.submitting') : t('register.submit')}
              </button>

              <div className={styles.loginBlock}>
                <div className={styles.divider} role="presentation">
                  <span className={styles.dividerLine} />
                  <span className={styles.dividerLabel}>{t('register.divider')}</span>
                  <span className={styles.dividerLine} />
                </div>

                <p className={styles.footerLink}>
                  <span>{t('register.alreadyAccount')}</span>{' '}
                  <Link href="/login" className={styles.loginLink}>
                    {t('register.loginLink')}
                  </Link>
                </p>
              </div>
            </form>
          )}

          <p className={styles.helpFoot}>
            {t('register.needHelp')}{' '}
            <Link href="/contacts" className={styles.supportLink}>
              {t('register.contactSupport')}
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

        <div className={styles.statsCard}>
          {STATS.map((stat, index) => (
            <div key={stat.label} className={styles.statGroup}>
              {index > 0 && <span className={styles.statDivider} aria-hidden="true" />}
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
