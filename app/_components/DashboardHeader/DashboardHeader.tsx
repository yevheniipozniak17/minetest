'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { isNavLinkActive, NAV_LINKS } from '../Header/navLinks';
import { useProfile } from '../ProfileProvider/ProfileProvider';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import { DashboardNav } from './DashboardNav/DashboardNav';
import styles from './DashboardHeader.module.css';

export function DashboardHeader() {
  const pathname = usePathname();
  const t = useTranslations('common');
  const { initial, photoUrl } = useProfile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={styles.mobileBar}>
        <button
          type="button"
          className={styles.hamburger}
          aria-label={t('shared.openMenu')}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => setIsMenuOpen(true)}
        >
          <Image src="/icons/icons/ic_twotone-menu.svg" alt="" width={20} height={20} />
        </button>

        <Link href="/dashboard" className={styles.logo} aria-label={t('dashNav.dashboardHome')}>
          <Image
            src="/icons/icons/logo.webp"
            alt={t('shared.logoAlt')}
            width={144}
            height={40}
            priority
          />
        </Link>

        <div className={styles.right}>
          <Link href="/dashboard/settings" className={styles.avatar} aria-label={t('shared.settings')}>
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt={t('shared.profileAlt')} className={styles.avatarImg} />
            ) : (
              initial
            )}
          </Link>
        </div>
      </div>

      <nav className={styles.desktopNav} aria-label={t('shared.mainNav')}>
        <span className={styles.navDivider} aria-hidden="true" />

        {NAV_LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={[styles.navLink, isNavLinkActive(link.href, pathname) && styles.navLinkActive]
              .filter(Boolean)
              .join(' ')}
            aria-current={isNavLinkActive(link.href, pathname) ? 'page' : undefined}
          >
            {t(`nav.${link.key}`).toUpperCase()}
          </Link>
        ))}

        <span className={styles.navDivider} aria-hidden="true" />

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
      </nav>

      <DashboardNav
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        pathname={pathname}
      />
    </header>
  );
}
