import Image from 'next/image';
import styles from './PreviewCard.module.css';
import type { PreviewCardProps } from '../Preview';

export default function PreviewCard({ icon, title, text }: PreviewCardProps) {
  return (
    <div className={styles.previewCard}>
      <Image
        className={styles.icon}
        src={icon}
        alt={title}
        width={177}
        height={124}
      />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      <button className={styles.button}>
        <Image src="/icons/icons/arrow-up.svg" alt="arrow-right" width={24} height={24} /> See More
      </button>
    </div>
  );
}
