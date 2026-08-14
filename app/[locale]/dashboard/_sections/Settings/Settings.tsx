'use client';

import { isAxiosError } from 'axios';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  updateProfile,
  changeAccountPassword,
  uploadPhoto,
  deletePhoto,
} from '@/lib/api/profile';
import type { UserProfileUpdate } from '@/lib/api/types';
import { COUNTRIES } from '@/lib/data/countries';
import { useProfile } from '@/app/_components/ProfileProvider/ProfileProvider';
import CountrySelect from './CountrySelect/CountrySelect';
import styles from './Settings.module.css';

type SectionId = 'profile' | 'security';

type PasswordStep = 'idle' | 'form' | 'done';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const SECTION_IDS: SectionId[] = ['profile', 'security'];

function getErrorText(err: unknown, fallback: string, networkError: string): string {
  if (isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    return fallback;
  }
  return networkError;
}

function scrollSubnavItemIntoView(button: HTMLButtonElement | undefined) {
  button?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
  });
}

export default function Settings() {
  const t = useTranslations('settings');

  const sectionRefs = useRef<Partial<Record<SectionId, HTMLElement | null>>>({});
  const subnavButtonRefs = useRef(new Map<SectionId, HTMLButtonElement>());
  const isProgrammaticScroll = useRef(false);
  const lastSyncedSectionId = useRef<SectionId>('profile');

  const {
    profile,
    initial,
    photoUrl,
    setProfile,
    markPhotoUploaded,
    markPhotoRemoved,
  } = useProfile();

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [activeSection, setActiveSection] = useState<SectionId>('profile');

  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const seeded = useRef(false);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const saveTimer = useRef<number | null>(null);
  const pendingSave = useRef<UserProfileUpdate>({});

  const [passwordStep, setPasswordStep] = useState<PasswordStep>('idle');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (seeded.current || !profile) return;
    seeded.current = true;
    setEmail(profile.email ?? '');
    setDisplayName(profile.username ?? '');
    setNickname(profile.game_username ?? '');
    setCountry(profile.country ?? '');
    setBio(profile.bio ?? '');
  }, [profile]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, []);

  const commitSave = useCallback(async () => {
    const payload = pendingSave.current;
    pendingSave.current = {};
    if (Object.keys(payload).length === 0) return;

    setSaveStatus('saving');
    try {
      await updateProfile(payload);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }, []);

  const queueSave = useCallback(
    (partial: UserProfileUpdate) => {
      pendingSave.current = { ...pendingSave.current, ...partial };
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        void commitSave();
      }, 600);
    },
    [commitSave],
  );

  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setPhotoError(null);
    setPhotoBusy(true);
    try {
      await uploadPhoto(file);
      markPhotoUploaded();
    } catch (err) {
      setPhotoError(getErrorText(err, t('errorUploadPhoto'), t('errorNetwork')));
    } finally {
      setPhotoBusy(false);
    }
  }

  async function handlePhotoRemove() {
    setPhotoError(null);
    setPhotoBusy(true);
    try {
      await deletePhoto();
      markPhotoRemoved();
    } catch (err) {
      setPhotoError(getErrorText(err, t('errorRemovePhoto'), t('errorNetwork')));
    } finally {
      setPhotoBusy(false);
    }
  }

  const scrollToSection = useCallback((id: SectionId) => {
    setActiveSection(id);
    lastSyncedSectionId.current = id;
    isProgrammaticScroll.current = true;

    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    scrollSubnavItemIntoView(subnavButtonRefs.current.get(id));

    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 700);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const resolveActiveSection = () => {
      const headerHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
      );
      const marker = (Number.isFinite(headerHeight) ? headerHeight : 72) + 40;
      let nextActiveSection = SECTION_IDS[0];

      for (const sectionId of SECTION_IDS) {
        const element = sectionRefs.current[sectionId];
        if (!element) continue;

        if (element.getBoundingClientRect().top <= marker) {
          nextActiveSection = sectionId;
        }
      }

      setActiveSection(nextActiveSection);

      if (lastSyncedSectionId.current !== nextActiveSection) {
        lastSyncedSectionId.current = nextActiveSection;
        scrollSubnavItemIntoView(subnavButtonRefs.current.get(nextActiveSection));
      }
    };

    const onScroll = () => {
      if (!mediaQuery.matches || isProgrammaticScroll.current) return;
      resolveActiveSection();
    };

    const onMediaChange = () => {
      if (mediaQuery.matches) {
        resolveActiveSection();
      } else {
        setActiveSection('profile');
        lastSyncedSectionId.current = 'profile';
      }
    };

    onMediaChange();
    window.addEventListener('scroll', onScroll, { passive: true });
    mediaQuery.addEventListener('change', onMediaChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      mediaQuery.removeEventListener('change', onMediaChange);
    };
  }, []);

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!currentPassword || !newPassword) {
      setError(t('errorMissingPasswords'));
      return;
    }
    if (newPassword.length < 10 || newPassword.length > 24) {
      setError(t('errorPasswordLength'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('errorPasswordMismatch'));
      return;
    }

    setStatus('saving');
    try {
      await changeAccountPassword({
        current: currentPassword,
        new_password: newPassword,
        confirm: confirmPassword,
      });
      setPasswordStepDone();
    } catch (err) {
      setError(getErrorText(err, t('errorChangePassword'), t('errorNetwork')));
    } finally {
      setStatus('idle');
    }
  }

  function setPasswordStepDone() {
    setPasswordStep('done');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  function openPasswordChange() {
    setError(null);
    setPasswordStep('form');
    scrollToSection('security');
  }

  function closePasswordChange() {
    setError(null);
    setPasswordStep('idle');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <div className={styles.shell}>
      <div className={styles.root}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>{t('eyebrow')}</span>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitleMobile}>{t('subtitleMobile')}</p>
          <p className={styles.subtitleDesktop}>{t('subtitleDesktop')}</p>
        </header>

        <div className={styles.body}>
          <nav className={styles.subnav} aria-label={t('subnavAriaLabel')}>
            <span className={styles.subnavLabel}>{t('subnavLabel')}</span>
            <div className={styles.subnavList}>
              {SECTION_IDS.map(sectionId => (
                <button
                  key={sectionId}
                  ref={node => {
                    if (node) {
                      subnavButtonRefs.current.set(sectionId, node);
                    } else {
                      subnavButtonRefs.current.delete(sectionId);
                    }
                  }}
                  type="button"
                  className={[
                    styles.subnavItem,
                    activeSection === sectionId && styles.subnavItemActive,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => scrollToSection(sectionId)}
                >
                  {t(`sections.${sectionId}`)}
                </button>
              ))}
            </div>
          </nav>

          <div className={styles.main}>
            <section
              ref={node => {
                sectionRefs.current.profile = node;
              }}
              id="settings-profile"
              className={styles.card}
            >
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>{t('sections.profile')}</h2>
                <span className={styles.savedBadge}>
                  <span className={styles.savedDot} aria-hidden="true" />
                  {saveStatus === 'saving' && t('saveStatus.saving')}
                  {saveStatus === 'saved' && t('saveStatus.saved')}
                  {saveStatus === 'error' && t('saveStatus.error')}
                  {saveStatus === 'idle' && t('saveStatus.idle')}
                </span>
              </div>

              <div className={styles.avatarRow}>
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className={styles.avatarLarge}
                    src={photoUrl}
                    alt={t('avatarAlt')}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span className={styles.avatarLarge} aria-hidden="true">
                    {initial}
                  </span>
                )}
                <div className={styles.avatarMeta}>
                  <span className={styles.avatarTitle}>{t('avatarTitle')}</span>
                  <span className={styles.avatarHintMobile}>{t('avatarHintMobile')}</span>
                  <span className={styles.avatarHintDesktop}>{t('avatarHintDesktop')}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    hidden
                    onChange={handlePhotoUpload}
                  />
                  <div className={styles.avatarActions}>
                    <button
                      type="button"
                      className={styles.primaryPill}
                      disabled={photoBusy}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className={styles.pillMobile}>
                        {photoBusy ? t('uploadingMobile') : t('uploadMobile')}
                      </span>
                      <span className={styles.pillDesktop}>
                        {photoBusy ? t('uploadingMobile') : t('uploadDesktop')}
                      </span>
                    </button>
                    <button
                      type="button"
                      className={styles.ghostPill}
                      disabled={photoBusy || !photoUrl}
                      onClick={handlePhotoRemove}
                    >
                      {t('remove')}
                    </button>
                  </div>
                  {photoError && <p className={styles.formError}>{photoError}</p>}
                </div>
              </div>

              <div className={styles.profileGrid}>
                <div className={styles.formCol}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="settings-display-name">
                      {t('displayNameLabel')}
                    </label>
                    <input
                      id="settings-display-name"
                      className={styles.input}
                      value={displayName}
                      onChange={event => {
                        setDisplayName(event.target.value);
                        setProfile({ username: event.target.value });
                        queueSave({ username: event.target.value });
                      }}
                    />
                    <p className={styles.help}>
                      <span className={styles.helpMobile}>{t('displayNameHelpMobile')}</span>
                      <span className={styles.helpDesktop}>{t('displayNameHelpDesktop')}</span>
                    </p>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="settings-nickname">
                      {t('nicknameLabel')}
                    </label>
                    <input
                      id="settings-nickname"
                      className={styles.input}
                      value={nickname}
                      onChange={event => {
                        setNickname(event.target.value);
                        setProfile({ game_username: event.target.value });
                        queueSave({ game_username: event.target.value });
                      }}
                    />
                    <p className={styles.help}>
                      <span className={styles.helpMobile}>{t('nicknameHelpMobile')}</span>
                      <span className={styles.helpDesktop}>{t('nicknameHelpDesktop')}</span>
                    </p>
                  </div>
                </div>

                <div className={styles.formCol}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="settings-email-readonly">
                      {t('emailLabel')}
                    </label>
                    <div className={styles.inputWithTag}>
                      <input
                        id="settings-email-readonly"
                        className={styles.inputInline}
                        value={email}
                        readOnly
                      />
                      <span className={styles.verifiedTag}>{t('emailVerified')}</span>
                    </div>
                    <p className={styles.helpDesktopOnly}>{t('emailHelp')}</p>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="settings-country">
                      {t('countryLabel')}
                    </label>
                    <CountrySelect
                      id="settings-country"
                      value={country}
                      countries={COUNTRIES}
                      onChange={next => {
                        setCountry(next);
                        setProfile({ country: next });
                        queueSave({ country: next });
                      }}
                    />
                    <p className={styles.helpDesktopOnly}>{t('countryHelp')}</p>
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="settings-bio">
                  {t('bioLabel')}
                </label>
                <div className={styles.textareaWrap}>
                  <textarea
                    id="settings-bio"
                    className={styles.textarea}
                    value={bio}
                    maxLength={240}
                    onChange={event => {
                      const next = event.target.value;
                      setBio(next);
                      setProfile({ bio: next });
                      queueSave({ bio: next });
                    }}
                  />
                  <div className={styles.textareaFoot}>
                    <span className={styles.markdownMobile}>{t('markdownMobile')}</span>
                    <span className={styles.markdownDesktop}>{t('markdownDesktop')}</span>
                    <span>
                      {bio.length} / 240
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section
              ref={node => {
                sectionRefs.current.security = node;
              }}
              id="settings-security"
              className={styles.card}
            >
              <h2 className={styles.cardTitleStandalone}>{t('sections.security')}</h2>

              <div className={styles.row}>
                <div className={styles.rowText}>
                  <span className={styles.rowTitle}>{t('passwordTitle')}</span>
                  <span className={styles.rowHintMobile}>{t('passwordHintMobile')}</span>
                  <span className={styles.rowHintDesktop}>{t('passwordHintDesktop')}</span>
                </div>
                <button type="button" className={styles.outlinePill} onClick={openPasswordChange}>
                  <span className={styles.pillMobile}>{t('changeMobile')}</span>
                  <span className={styles.pillDesktop}>{t('changeDesktop')}</span>
                </button>
              </div>

              {passwordStep !== 'idle' && (
                <div className={styles.passwordPanel}>
                  {error && <p className={styles.formError}>{error}</p>}

                  {passwordStep === 'done' ? (
                    <div className={styles.passwordDone}>
                      <p className={styles.successText}>{t('passwordDone')}</p>
                      <button type="button" className={styles.outlinePill} onClick={closePasswordChange}>
                        {t('close')}
                      </button>
                    </div>
                  ) : (
                    <form className={styles.passwordForm} onSubmit={handleChangePassword} noValidate>
                      <p className={styles.passwordIntro}>{t('passwordIntro')}</p>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="settings-current">
                          {t('currentPasswordLabel')}
                        </label>
                        <input
                          id="settings-current"
                          type="password"
                          className={styles.input}
                          value={currentPassword}
                          onChange={event => setCurrentPassword(event.target.value)}
                          autoComplete="current-password"
                          required
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="settings-new">
                          {t('newPasswordLabel')}
                        </label>
                        <input
                          id="settings-new"
                          type="password"
                          className={styles.input}
                          value={newPassword}
                          onChange={event => setNewPassword(event.target.value)}
                          autoComplete="new-password"
                          minLength={10}
                          maxLength={24}
                          required
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="settings-confirm">
                          {t('confirmPasswordLabel')}
                        </label>
                        <input
                          id="settings-confirm"
                          type="password"
                          className={styles.input}
                          value={confirmPassword}
                          onChange={event => setConfirmPassword(event.target.value)}
                          autoComplete="new-password"
                          minLength={10}
                          maxLength={24}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className={styles.primaryPillWide}
                        disabled={status !== 'idle'}
                      >
                        {status === 'saving' ? t('savePasswordSaving') : t('savePasswordIdle')}
                      </button>
                      <button type="button" className={styles.textBtn} onClick={closePasswordChange}>
                        {t('cancel')}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
