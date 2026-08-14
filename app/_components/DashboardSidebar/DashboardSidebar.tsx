'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { performClientLogout } from '@/lib/client/logout';
import { useProfile } from '../ProfileProvider/ProfileProvider';
import { LogoutModal } from '../LogoutModal/LogoutModal';
import { LogoutOverlay } from '../LogoutOverlay/LogoutOverlay';
import { useCartItemCount } from '@/lib/client/cartCount';
import { dashboardIconStyle as iconStyle, WORKSPACE_LINKS } from '../dashboardNav';
import { isNavLinkActive } from '../Header/navLinks';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import styles from './DashboardSidebar.module.css';

export function DashboardSidebar() {
  const pathname = usePathname();
  const t = useTranslations('common');
  const { profile, displayName: name, initial, photoUrl } = useProfile();
  const email = profile?.email ?? '';
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const cartCount = useCartItemCount();
  const workspaceLinks = WORKSPACE_LINKS.map(link =>
    link.href === '/dashboard/cart' ? { ...link, badge: cartCount } : link
  );

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await performClientLogout();
    } finally {
      setLogoutOpen(false);
    }
  }

  return (
    <>
    <aside className={styles.sidebar} aria-label={t('dashNav.dashboardNav')}>
      <Link href="/dashboard" className={styles.logo}>
        <Image
          src="/icons/icons/logo.webp"
          alt={t('shared.logoAlt')}
          width={214}
          height={59}
          priority
        />
      </Link>

      <Link href="/dashboard/settings" className={styles.userCard} aria-label={t('shared.settings')}>
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.avatar}
            src={photoUrl}
            alt={t('shared.profileAlt')}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <span className={styles.avatar} aria-hidden="true">
            {initial}
          </span>
        )}
        <div className={styles.userInfo}>
          <span className={styles.userName}>{name}</span>
        </div>
      </Link>

      <div className={styles.sectionLabel}>
        <span>{t('shared.myWorkspace')}</span>
        <span className={styles.sectionLine} aria-hidden="true" />
      </div>

      <nav className={styles.workspace} aria-label={t('shared.myWorkspace')}>
        {workspaceLinks.map(link => {
          const isActive = link.href !== '#' && isNavLinkActive(link.href, pathname);
          const isDisabled = link.soon && link.href === '#';
          const className = [
            styles.wsItem,
            isActive && styles.wsItemActive,
            isDisabled && styles.wsItemDisabled,
          ]
            .filter(Boolean)
            .join(' ');

          const content = (
            <>
              <span className={styles.wsIcon} style={iconStyle(link.icon)} aria-hidden="true" />
              <span className={styles.wsLabel}>{t(`dash.${link.key}`)}</span>
              {typeof link.badge === 'number' && link.badge > 0 && (
                <span className={styles.badge}>{link.badge}</span>
              )}
              {link.soon && <span className={styles.soon}>{t('shared.soon')}</span>}
            </>
          );

          if (isDisabled) {
            return (
              <span key={link.key} className={className} aria-disabled="true">
                {content}
              </span>
            );
          }

          return (
            <Link
              key={link.key}
              href={link.href}
              className={className}
              aria-current={isActive ? 'page' : undefined}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.spacer} aria-hidden="true">
          <Image
            src="/profile/dashboard-cat.png"
            alt=""
            width={130}
            height={142}
            className={styles.spacerMascot}
          />
        </div>

        <hr className={styles.divider} />

        <div className={styles.account}>
          <Link href="/dashboard/settings" className={styles.footItem}>
            <span
              className={styles.wsIcon}
              style={iconStyle('settings-outline')}
              aria-hidden="true"
            />
            <span className={styles.footLabel}>{t('shared.settings')}</span>
          </Link>
          <button
            type="button"
            className={styles.footItem}
            onClick={() => setLogoutOpen(true)}
            disabled={loggingOut}
          >
            <span className={styles.wsIcon} style={iconStyle('logout-outline')} aria-hidden="true" />
            <span className={styles.footLabel}>{loggingOut ? t('shared.loggingOut') : t('shared.logOut')}</span>
          </button>
        </div>
      </div>

      <div className={styles.bottom}>
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

    <LogoutModal
      isOpen={logoutOpen}
      onClose={() => setLogoutOpen(false)}
      onConfirm={handleLogout}
      name={name}
      email={email}
      initial={initial}
      confirming={loggingOut}
    />

    <LogoutOverlay show={loggingOut} />
    </>
  );
}
