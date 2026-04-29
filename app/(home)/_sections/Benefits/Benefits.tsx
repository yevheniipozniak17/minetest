import BenefitsList from './BenefitsList/BenefitsList';
import styles from './Benefits.module.css';
import { Divider } from '../../../_components/Divider/Divider';

export type BenefitsCardProps = {
  title: string;
  text: string;
};

const Data: BenefitsCardProps[] = [
  {
    title: 'Stable servers',
    text: 'High uptime and smooth performance — no lag, no crashes.',
  },
  {
    title: 'Regular updates',
    text: 'New features, fixes, and improvements every month.',
  },
  {
    title: 'High online',
    text: 'An active community playing daily across all servers.',
  },
  {
    title: 'Fair economy',
    text: 'No pay-to-win. Balance comes first.',
  },
  {
    title: 'Active team',
    text: 'Moderation, support, and development always online.',
  },
  {
    title: 'Player support',
    text: 'Fast help via Discord and in-game support.',
  },
];

export default function BenefitsSection() {
  return (
    <>
      <section className={styles.benefitsSection}>
        <h2 className={styles.title}>Why Play With Us?</h2>
        <BenefitsList items={Data} />
        <div className={styles.benefitsVideoContainer}>
          <div className={styles.overlay}></div>
          <video className={styles.video} autoPlay loop muted playsInline preload="auto">
            <source src="/video/benefits-video.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
      <Divider />
    </>
  );
}
