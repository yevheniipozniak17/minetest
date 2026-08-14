import Image from 'next/image';
import styles from './FeaturesCard.module.css';
import type { FeaturesCardProps } from '../Features';

export default function FeaturesCard({
  title,
  text,
  description,
  icon,
}: FeaturesCardProps) {
  return (
    <div className={styles.featuresCard}>
      <span className={styles.icon}>
        <Image src={icon} alt={title} width={24} height={24} />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
