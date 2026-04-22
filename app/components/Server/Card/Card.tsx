import Link from 'next/link';
import Image from 'next/image';
import styles from './Card.module.css';

export type CardProps = {
  title: string;
  text: string;
  description: string;
  icon: string;
  link: string;
};

export function Card({ title, text, description, icon, link }: CardProps) {
  return (
    <div className={styles.card}>
      <Image className={styles.icon} src={icon} alt={title} width={203} height={191} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      <p className={styles.description}>{description}</p>

      <ul className={styles.list}>
        <li className={styles.item}>
          Status
          <div className={styles.status}>
            <Image
              className={styles.statusDot}
              src="/icons/icons/ellipse.svg"
              alt="Online"
              width={7}
              height={7}
            />
            Online
          </div>
        </li>
        <li className={styles.item}>
          Players online:
          <div className={styles.status}>
            <Image
              className={styles.statusIcon}
              src="/icons/icons/user.svg"
              alt="Players"
              width={13}
              height={13}
            />
            32
          </div>
        </li>
        <li className={styles.item}>
          Server IP: <div className={styles.status}>play.luckysurvival.com</div>
        </li>
      </ul>

      <Link className={styles.linkButton} href={link}>
        <Image src="/icons/icons/arrow-up.svg" alt="Join" width={24} height={24} />
        <p>Join {title}</p>
      </Link>
    </div>
  );
}
