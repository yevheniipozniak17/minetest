'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '../../LanguageSwitcher/LanguageSwitcher';
import { isNavLinkActive, LEGAL_LINKS, NAV_LINKS, SOCIAL_LINKS } from '../navLinks';
import styles from './MobileNav.module.css';

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
};

export function MobileNav({ isOpen, onClose, pathname }: MobileNavProps) {
  const t = useTranslations('common');

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.overlay}
        aria-label={t('shared.closeMenu')}
        onClick={onClose}
      />

      <aside
        id="mobile-nav-drawer"
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={t('mobileNav.mobileNavLabel')}
      >
        <div className={styles.topbar}>
          <Link href="/" className={styles.logo} onClick={onClose}>
            <Image
              src="/icons/icons/logo.webp"
              alt={t('shared.logoAlt')}
              width={144}
              height={40}
              priority
            />
          </Link>
          <button type="button" className={styles.closeButton} aria-label={t('shared.closeMenu')} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.authRow}>
          <Link href="/login" className={styles.loginButton} onClick={onClose}>
            {t('mobileNav.logIn')}
          </Link>
          <Link href="/register" className={styles.signupButton} onClick={onClose}>
            {t('mobileNav.signUp')}
          </Link>
        </div>

        <Link href="/servers" className={styles.statusCard} onClick={onClose}>
          <span className={styles.statusDot} aria-hidden="true" />
          <span className={styles.statusText}>
            <span className={styles.statusTitle}>{t('mobileNav.serversTitle')}</span>
            <span className={styles.statusSubtitle}>{t('mobileNav.serversSubtitle')}</span>
          </span>
          <span className={styles.statusChevron} aria-hidden="true">
            ›
          </span>
        </Link>

        <div className={styles.sectionLabel}>
          <span>{t('shared.browseSite')}</span>
          <span className={styles.sectionLine} aria-hidden="true" />
        </div>

        <nav className={styles.nav} aria-label={t('shared.browseSite')}>
          {NAV_LINKS.map(link => {
            const isActive = isNavLinkActive(link.href, pathname);

            return (
              <Link
                key={link.href}
                href={link.href}
                locale={link.key === 'blog' ? 'en' : undefined}
                className={[styles.navLink, isActive && styles.navLinkActive].filter(Boolean).join(' ')}
                aria-current={isActive ? 'page' : undefined}
                onClick={onClose}
              >
                <span>{t(`nav.${link.key}`)}</span>
                <span className={styles.navChevron} aria-hidden="true">
                  ›
                </span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sectionLabel}>
          <span>{t('mobileNav.community')}</span>
          <span className={styles.sectionLine} aria-hidden="true" />
        </div>

        <div className={styles.socialRow}>
          {SOCIAL_LINKS.map(link => (
            <a
              key={link.alt}
              href={link.href}
              className={styles.socialButton}
              aria-label={link.alt}
              target="_blank"
              rel="noreferrer"
            >
              <Image src={link.icon} alt="" width={link.size} height={link.size} />
            </a>
          ))}
        </div>

        <div className={styles.spacer} aria-hidden="true" />

        <hr className={styles.divider} />

        <div className={styles.legalRow}>
          {LEGAL_LINKS.map((link, index) => (
            <span key={link.href} className={styles.legalItem}>
              {index > 0 && <span className={styles.legalSeparator} aria-hidden="true">·</span>}
              <Link href={link.href} className={styles.legalLink} onClick={onClose}>
                {t(`legal.${link.key}`)}
              </Link>
            </span>
          ))}
        </div>

        <div className={styles.bottomRow}>
          <LanguageSwitcher
            className={styles.langButton}
            openUp
            arrow={
              <span className={styles.langArrow} aria-hidden="true">
                ▾
              </span>
            }
          />
          <span className={styles.version}>v 2.6.0</span>
        </div>
      </aside>
    </div>
  );
}
