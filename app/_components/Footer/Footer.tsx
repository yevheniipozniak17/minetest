import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';
import { Container } from '../Container/Container';

const SOCIAL_LINKS = [
  { icon: '/icons/social/ic_outline-discord.svg', alt: 'Discord', href: '#', size: 24 },
  { icon: '/icons/social/prime_twitter.svg', alt: 'Twitter', href: '#', size: 18 },
  { icon: '/icons/social/mingcute_youtube-fill.svg', alt: 'YouTube', href: '#', size: 24 },
  { icon: '/icons/social/ic_twotone-tiktok.svg', alt: 'TikTok', href: '#', size: 24 },
];

const MAIN_LINKS = [
  { label: 'Store', href: '/store' },
  { label: 'Rules', href: '/rules' },
  { label: 'About', href: '/about' },
  { label: 'Contacts', href: '/contacts' },
];

const SUPPORT_LINKS = [
  { label: 'How to Start Playing', href: '/how-to-start' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'Terms and Conditions', href: '/terms' },
];

const PAYMENT_ICONS = [
  { icon: '/icons/payment/Visa.svg', alt: 'Visa' },
  { icon: '/icons/payment/ApplePay.svg', alt: 'Apple Pay' },
  { icon: '/icons/payment/Mastercard.svg', alt: 'Mastercard' },
  { icon: '/icons/payment/GooglePay.svg', alt: 'Google Pay' },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.content}>
        <div className={styles.top}>
          {/* Left section: Logo + Description + Socials */}
          <div className={styles.info}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/icons/icons/logo.svg"
                alt="Minecraft game logo"
                width={214}
                height={59}
              />
            </Link>

            <p className={styles.description}>
              Building a modern Minecraft ecosystem with stable servers, fair gameplay, and an
              active community.
            </p>

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
              <h3 className={styles.columnTitle}>Main</h3>
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
              <h3 className={styles.columnTitle}>Support</h3>
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

        {/* Decorative grass left */}
        <div className={styles.grassLeft}>
          <Image
            src="/icons/illustrations/footer-left-grass.svg"
            alt=""
            width={253}
            height={151}
            aria-hidden="true"
          />
        </div>

        {/* Decorative grass right (desktop) */}
        <div className={styles.grassRight}>
          <Image
            src="/icons/illustrations/footer-rigth-grass.svg"
            alt=""
            width={308}
            height={183}
            aria-hidden="true"
          />
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; 2026 Adventures in Minecraft. All rights reserved.
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
