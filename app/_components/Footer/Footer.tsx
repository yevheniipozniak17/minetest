'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { NAV_LINKS, SOCIAL_LINKS } from '../Header/navLinks';
import styles from './Footer.module.css';
import { Container } from '../Container/Container';

const PAYMENT_ICONS = [
  { icon: '/icons/payment/Visa.svg', alt: 'Visa' },
  { icon: '/icons/payment/ApplePay.svg', alt: 'Apple Pay' },
  { icon: '/icons/payment/Mastercard.svg', alt: 'Mastercard' },
  { icon: '/icons/payment/GooglePay.svg', alt: 'Google Pay' },
];

export function Footer() {
  const t = useTranslations('common');

  const NAV_MAIN_LINKS = NAV_LINKS.filter(
    link => link.href !== '/' && link.href !== '/how-to-start' && link.href !== '/faq',
  ).map(link => ({
    label: t(`nav.${link.key}`),
    href: link.href,
  }));

  const storeIndex = NAV_MAIN_LINKS.findIndex(link => link.href === '/store');

  const MAIN_LINKS = [
    ...NAV_MAIN_LINKS.slice(0, storeIndex + 1),
    { label: t('footer.howToStartPlaying'), href: '/how-to-start' },
    ...NAV_MAIN_LINKS.slice(storeIndex + 1),
    { label: t('footer.contacts'), href: '/contacts' },
  ];

  const SUPPORT_LINKS = [
    { label: t('footer.privacyPolicy'), href: '/privacy-policy' },
    { label: t('footer.cookiePolicy'), href: '/cookie-policy' },
    { label: t('footer.termsAndConditions'), href: '/terms' },
    { label: t('footer.deliveryPolicy'), href: '/delivery-policy' },
  ];

  return (
    <footer className={styles.footer}>
      {/* Decorative grass — anchored to footer edges (full viewport width) */}
      <div className={styles.grassLeft}>
        <Image
          src="/footer/images/footer-left-grass.webp"
          alt=""
          width={253}
          height={151}
          aria-hidden="true"
        />
      </div>
      <div className={styles.grassRight}>
        <Image
          src="/footer/images/footer-rigth-grass.webp"
          alt=""
          width={308}
          height={183}
          aria-hidden="true"
        />
      </div>

      <Container className={styles.content}>
        <div className={styles.top}>
          {/* Left section: Logo + Description + Socials */}
          <div className={styles.info}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/icons/icons/logo.webp"
                alt={t('shared.logoAlt')}
                width={214}
                height={59}
              />
            </Link>

            <picture>
              <source srcSet="/footer/images/legal-address.webp" type="image/webp" />
              <img
                src="/footer/images/legal-address.png"
                alt={t('footer.legalAddressAlt')}
                width={348}
                height={88}
                className={styles.address}
                loading="lazy"
                decoding="async"
              />
            </picture>

            <div className={styles.socials}>
              {SOCIAL_LINKS.map(link => (
                <a
                  key={link.alt}
                  href={link.href}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.alt}
                >
                  <Image src={link.icon} alt={link.alt} width={link.size} height={link.size} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          <div className={styles.columns}>
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>{t('footer.mainTitle')}</h3>
              <ul className={styles.columnList}>
                {MAIN_LINKS.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.columnLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.column}>
              <h3 className={styles.columnTitle}>{t('footer.legalTitle')}</h3>
              <ul className={styles.columnList}>
                {SUPPORT_LINKS.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.columnLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            {t('footer.copyright')}
          </p>
          <div className={styles.payments}>
            {PAYMENT_ICONS.map(icon => (
              <Image key={icon.alt} src={icon.icon} alt={icon.alt} width={44} height={30} />
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
