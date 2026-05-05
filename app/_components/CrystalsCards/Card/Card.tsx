import Image from 'next/image';
import { CrystalsCardProps } from '../CrystalsCards';
import styles from './Card.module.css';

export default function Card({ title, text, icon }: CrystalsCardProps) {
  return (
    <li className={styles.slide}>
      <article className={styles.card}>
        <Image className={styles.icon} src={icon} alt={title} width={177} height={124} />
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{text}</p>
        <button type="button" className={styles.button}>
          <Image
            src="/icons/icons/arrow-up.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden
          />
          See More
        </button>
      </article>
    </li>
  );
}
