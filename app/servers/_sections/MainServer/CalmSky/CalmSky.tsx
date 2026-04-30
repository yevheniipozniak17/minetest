import styles from './CalmSky.module.css';
import CalmSkyAbout from './CalmSkyAbout/CalmSkyAbout';
import CalmSkyActions from './CalmSkyActions/CalmSkyActions';
import CalmSkyFeatures from './CalmSkyFeatures/CalmSkyFeatures';
import CalmSkyGamesModes from './CalmSkyGamesModes/CalmSkyGamesModes';
import CalmSkyHeader from './CalmSkyHeader/CalmSkyHeader';
import CalmSkyHowToStart from './CalmSkyHowToStart/CalmSkyHowToStart';
import CalmSkyStatus from './CalmSkyStatus/CalmSkyStatus';

export default function CalmSky() {
  return (
    <>
      <CalmSkyHeader />
      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <CalmSkyGamesModes />
          <CalmSkyAbout />
          <CalmSkyStatus />
        </div>
        <div className={styles.rightColumn}>
          <CalmSkyActions />
          <CalmSkyFeatures />
          <CalmSkyHowToStart />
        </div>
      </div>
    </>
  );
}
