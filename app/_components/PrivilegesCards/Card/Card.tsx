import Image from 'next/image';
import { PrivilegesCardProps } from '../PrivilegesCards';
import styles from './Card.module.css';

export default function Card({ title, text, icon }: PrivilegesCardProps) {
  console.log(icon);
  return (
    <li className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      <Image className={styles.icon} src={icon} alt={title} />
      <button type="button" className={styles.button}>
        <Image
          src="/icons/icons/arrow-up.svg"
          alt="Add to cart"
          width={24}
          height={24}
          aria-hidden
        />
        Add to cart
      </button>
    </li>
  );
}
