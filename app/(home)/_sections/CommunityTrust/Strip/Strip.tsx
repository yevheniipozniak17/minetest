import Image from 'next/image';
import styles from './Strip.module.css';

const STRIP_LOGOS: ReadonlyArray<{
  src: string;
  alt: string;
  width: number;
  height: number;
}> = [
  { src: '/icons/strip/startup.svg', alt: 'Startup', width: 115, height: 27 },
  { src: '/icons/strip/company.svg', alt: 'Company', width: 135, height: 27 },
  { src: '/icons/strip/business.svg', alt: 'Business', width: 127, height: 27 },
  { src: '/icons/strip/agency.svg', alt: 'Agency', width: 115, height: 27 },
];

type StripProps = {
  className?: string;
};

export default function Strip({ className }: StripProps) {
  return (
    <div
      className={[styles.marquee, className].filter(Boolean).join(' ')}
      role="list"
      aria-label="Featured on"
    >
      <div className={styles.track}>
        {STRIP_LOGOS.map((logo) => (
          <div className={styles.item} key={logo.src} role="listitem">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
            />
          </div>
        ))}
        {STRIP_LOGOS.map((logo) => (
          <div
            className={styles.item}
            key={`${logo.src}-clone`}
            aria-hidden="true"
          >
            <Image
              src={logo.src}
              alt=""
              width={logo.width}
              height={logo.height}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export { STRIP_LOGOS };
