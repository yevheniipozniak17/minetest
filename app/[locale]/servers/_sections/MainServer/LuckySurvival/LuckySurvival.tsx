import styles from './LuckySurvival.module.css';
import LuckyHeader from './LuckyHeader/LuckyHeader';
import LuckyGamesModes from './LuckyGamesModes/LuckyGamesModes';
import LuckyAbout from './LuckyAbout/LuckyAbout';
import LuckyFeatures from './LuckyFeatures/LuckyFeatures';
import LuckyHowToStart from './LuckyHowToStart/LuckyHowToStart';
import LuckyActions from './LuckyActions/LuckyActions';
import LuckyStatus from './LuckyStatus/LuckyStatus';

export default function LuckySurvival({ isAuthed = false }: { isAuthed?: boolean }) {
  return (
    <>
      <LuckyHeader />
      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <LuckyGamesModes />
          <LuckyAbout />
          <LuckyStatus />
        </div>
        <div className={styles.rightColumn}>
          <LuckyActions isAuthed={isAuthed} />
          <LuckyFeatures />
          <LuckyHowToStart />
        </div>
      </div>
    </>
  );
}
