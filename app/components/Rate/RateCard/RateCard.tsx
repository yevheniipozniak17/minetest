import Image from 'next/image';
import { RateCardProps } from '../Rate';
import styles from './RateCard.module.css';

export default function RateCard({
  rank,
  player,
  server,
  level,
  play_time,
  active_score,
}: RateCardProps) {
  return (
    <li className={styles.rateCard}>
      <div className={styles.titleContainer}>
        <p className={styles.title}>
          Rank
          <span className={styles.titleValue}>
            <Image src="/icons/illustrations/champ-cup.svg" alt="Rank" width={20} height={22} />
            {rank}
          </span>
        </p>
        <p className={styles.title}>
          Level<span className={styles.titleValue}>{level}</span>
        </p>
      </div>
      <div className={styles.titleContainer}>
        <p className={styles.title}>
          Player<span className={styles.titleValue}>{player}</span>
        </p>
        <p className={styles.title}>
          Playtime<span className={styles.titleValue}>{play_time}</span>
        </p>
      </div>
      <div className={styles.titleContainer}>
        <p className={styles.title}>
          Server <span className={styles.titleValue}>{server}</span>
        </p>
        <p className={styles.title}>
          Activity Score<span className={styles.titleValue}>{active_score}</span>
        </p>
      </div>
    </li>
  );
}
