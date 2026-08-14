import Image from 'next/image';
import styles from './Card.module.css';
import type { CardProps } from '../CardList';

export default function Card({ image, ganre, title, description }: CardProps) {
  return (
    <li className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={image}
          alt={title}
          width={335}
          height={200}
          sizes="(min-width: 1280px) 33vw, 335px"
        />
      </div>
      <div className={styles.card_content}>
        <span className={styles.ganre}>{ganre}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </li>
  );
}
