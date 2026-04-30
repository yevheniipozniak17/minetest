import styles from './MineWars.module.css';
import MineWarsAbout from './MineWarsAbout/MineWarsAbout';
import MineWarsActions from './MineWarsActions/MineWarsActions';
import MineWarsFeatures from './MineWarsFeatures/MineWarsFeatures';
import MineWarsGamesModes from './MineWarsGamesModes/MineWarsGamesModes';
import MineWarsHeader from './MineWarsHeader/MineWarsHeader';
import MineWarsHowToStart from './MineWarsHowToStart/MineWarsHowToStart';
import MineWarsStatus from './MineWarsStatus/MineWarsStatus';

export default function MineWars() {
  return (
    <>
      <MineWarsHeader />
      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <MineWarsGamesModes />
          <MineWarsAbout />
          <MineWarsStatus />
        </div>
        <div className={styles.rightColumn}>
          <MineWarsActions />
          <MineWarsFeatures />
          <MineWarsHowToStart />
        </div>
      </div>
    </>
  );
}
