'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useProfile } from '../ProfileProvider/ProfileProvider';
import { Container } from '../Container/Container';
import { DashboardNav } from '../DashboardHeader/DashboardNav/DashboardNav';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import { MobileNav } from './MobileNav/MobileNav';
import { isNavLinkActive, NAV_LINKS } from './navLinks';
import styles from './Header.module.css';

function HeaderAccount() {
  const t = useTranslations('common');
  const { displayName, initial, photoUrl } = useProfile();

  return (
    <Link href="/dashboard" className={styles.account} aria-label={t('header.goToDashboard')}>
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.avatar} src={photoUrl} alt={t('shared.profileAlt')} />
      ) : (
        <span className={styles.avatar} aria-hidden="true">
          {initial}
        </span>
      )}
      <span className={styles.nick}>{displayName}</span>
    </Link>
  );
}

export function Header({ isAuthed = false }: { isAuthed?: boolean }) {
  const pathname = usePathname();
  const t = useTranslations('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <div className={`${styles.divider} ${styles.dividerEdge}`} />

        <Link href="/" className={styles.logo}>
          <Image
            src="/icons/icons/logo.webp"
            alt={t('shared.logoAlt')}
            width={215}
            height={59}
            priority
          />
        </Link>

        <div className={styles.divider} />

        <nav className={styles.nav} aria-label={t('shared.mainNav')}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                styles.navLink,
                isNavLinkActive(link.href, pathname) && styles.navLinkActive,
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isNavLinkActive(link.href, pathname) ? 'page' : undefined}
            >
              {t(`nav.${link.key}`).toUpperCase()}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          aria-label={t('shared.openMenu')}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => setIsMenuOpen(true)}
        >
          <Image src="/icons/icons/ic_twotone-menu.svg" alt="" width={24} height={24} />
        </button>

        <div className={styles.divider} />

        <div className={styles.authButtons}>
          {isAuthed ? (
            <HeaderAccount />
          ) : (
            <>
              <Link href="/login" className={styles.btnSecondary}>
                {t('header.logIn')}
              </Link>
              <Link href="/register" className={styles.btnPrimary}>
                {t('header.signUp')}
              </Link>
            </>
          )}
        </div>

        <div className={styles.dividerDesktop} />

        <LanguageSwitcher
          className={styles.langButton}
          menuAlign="right"
          arrow={
            <Image
              src="/icons/icons/fe_arrow-down.svg"
              alt=""
              width={15}
              height={15}
              className={styles.langArrow}
            />
          }
        />

        <div className={`${styles.divider} ${styles.dividerEdge}`} />
      </Container>

      {isAuthed ? (
        <DashboardNav
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          pathname={pathname}
        />
      ) : (
        <MobileNav
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          pathname={pathname}
        />
      )}
    </header>
  );
}
