import Image from 'next/image';
import styles from './BenefitsCard.module.css';
import type { BenefitsCardProps } from '../Benefits';

export default function BenefitsCard({ title, text }: BenefitsCardProps) {
  return (
    <li className={styles.benefitsCard}>
      <Image
        className={styles.dot}
        src="/icons/icons/ellipse.svg"
        alt=""
        aria-hidden="true"
        width={9}
        height={9}
      />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </li>
  );
}
