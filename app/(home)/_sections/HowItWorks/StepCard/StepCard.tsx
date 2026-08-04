import Image from 'next/image';
import styles from './StepCard.module.css';

export type StepCardProps = {
  number: string;
  icon: string;
  isArtwork?: boolean;
  title: string;
  text: string;
};

export default function StepCard({
  number,
  icon,
  isArtwork = false,
  title,
  text,
}: StepCardProps) {
  return (
    <li className={styles.card}>
      <span className={styles.number} aria-hidden="true">
        {number}
      </span>
      <span className={isArtwork ? styles.artwork : styles.icon}>
        <Image
          src={icon}
          alt=""
          width={isArtwork ? 96 : 28}
          height={isArtwork ? 96 : 28}
          className={isArtwork ? styles.artworkImage : undefined}
          aria-hidden="true"
        />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </li>
  );
}
