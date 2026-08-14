import Image from 'next/image';
import styles from './Strip.module.css';

const STRIP_LOGO_HEIGHT = 32;

const STRIP_SOURCES = [
  { src: '/icons/strip/reddit.png', alt: 'Reddit', naturalWidth: 400, naturalHeight: 400 },
  { src: '/icons/strip/TikTok.png', alt: 'TikTok', naturalWidth: 400, naturalHeight: 400 },
  { src: '/icons/strip/twitch.png', alt: 'Twitch', naturalWidth: 400, naturalHeight: 246 },
  { src: '/icons/strip/twitter.png', alt: 'Twitter', naturalWidth: 400, naturalHeight: 400 },
  { src: '/icons/strip/youtube.png', alt: 'YouTube', naturalWidth: 512, naturalHeight: 512 },
] as const;

const STRIP_LOGOS = STRIP_SOURCES.map((logo) => ({
  src: logo.src,
  alt: logo.alt,
  width: Math.round(STRIP_LOGO_HEIGHT * (logo.naturalWidth / logo.naturalHeight)),
  height: STRIP_LOGO_HEIGHT,
}));

type StripProps = {
  className?: string;
  ariaLabel?: string;
};

export default function Strip({ className, ariaLabel = 'Featured on' }: StripProps) {
  return (
    <div
      className={[styles.marquee, className].filter(Boolean).join(' ')}
      role="list"
      aria-label={ariaLabel}
    >
      <div className={styles.track}>
        {STRIP_LOGOS.map((logo) => (
          <div className={styles.item} key={logo.src} role="listitem">
            <span className={styles.logoSlot} style={{ width: logo.width }}>
              <Image
                className={styles.logo}
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
              />
            </span>
          </div>
        ))}
        {STRIP_LOGOS.map((logo) => (
          <div
            className={styles.item}
            key={`${logo.src}-clone`}
            aria-hidden="true"
          >
            <span className={styles.logoSlot} style={{ width: logo.width }}>
              <Image
                className={styles.logo}
                src={logo.src}
                alt=""
                width={logo.width}
                height={logo.height}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
