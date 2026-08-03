import Image from 'next/image';
import styles from './StepCard.module.css';

export type StepCardProps = {
  number: string;
  icon: string;
  title: string;
  text: string;
};

export default function StepCard({ number, icon, title, text }: StepCardProps) {
  return (
    <li className={styles.card}>
      <span className={styles.number} aria-hidden="true">
        {number}
      </span>
      <span className={styles.icon}>
        <Image src={icon} alt="" width={28} height={28} aria-hidden="true" />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </li>
  );
}
