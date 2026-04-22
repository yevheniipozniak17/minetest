import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../Container/Container';
import styles from './Header.module.css';

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'SERVERS', href: '/servers' },
  { label: 'STORE', href: '/store' },
  { label: 'HOW TO START', href: '/how-to-start' },
  { label: 'BLOG', href: '/blog' },
  { label: 'ABOUT', href: '/about' },
];

export function Header() {
  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <div className={`${styles.divider} ${styles.dividerEdge}`} />

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Image src="/icons/icons/logo.svg" alt="Minecraft game logo" width={215} height={59} />
        </Link>

        <div className={styles.divider} />

        {/* Desktop nav */}
        <nav className={styles.nav}>
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile burger */}
        <button className={styles.menuButton} aria-label="Open menu">
          <Image src="/icons/icons/ic_twotone-menu.svg" alt="" width={24} height={24} />
        </button>

        <div className={styles.divider} />

        {/* Desktop auth buttons */}
        <div className={styles.authButtons}>
          <button className={styles.btnSecondary}>Log In</button>
          <button className={styles.btnPrimary}>Sign UP</button>
        </div>

        <div className={styles.dividerDesktop} />

        <button className={styles.langButton}>
          <span>EN</span>
          <Image
            src="/icons/icons/fe_arrow-down.svg"
            alt=""
            width={15}
            height={15}
            className={styles.langArrow}
          />
        </button>

        <div className={`${styles.divider} ${styles.dividerEdge}`} />
      </Container>
    </header>
  );
}
