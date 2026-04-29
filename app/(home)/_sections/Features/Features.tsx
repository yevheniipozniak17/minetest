import { Container } from '@/app/_components/Container/Container';
import styles from './Features.module.css';

import FeaturesList from './FeaturesList/FeaturesList';
import { Divider } from '@/app/_components/Divider/Divider';

export type FeaturesCardProps = {
  title: string;
  text: string;
  description: string;
  icon: string;
};

const Data: FeaturesCardProps[] = [
  {
    title: 'Build & Create',
    text: 'Build freely. Shape your world.',
    description:
      'Create bases, cities, and landscapes with no limits. From small builds to massive projects — your imagination sets the rules.',
    icon: '/icons/icons/features-box.svg',
  },
  {
    title: 'Survive & Compete',
    text: 'Fight, survive, and dominate.',
    description:
      'Engage in PvP battles, raids, and survival challenges. Prove your skills and climb the rankings.',
    icon: '/icons/icons/features-crown.svg',
  },
  {
    title: 'Skins & Cosmetics',
    text: 'Stand out visually.',
    description:
      'Customize your character with unique skins, effects, and visual upgrades. No gameplay advantage — only style.',
    icon: '/icons/icons/features-mask.svg',
  },
  {
    title: 'In-game Economy',
    text: 'Trade. Earn. Progress.',
    description:
      'A balanced economy powered by in-game currency. Trade with players, buy upgrades, and grow your wealth.',
    icon: '/icons/icons/features-dollar.svg',
  },
  {
    title: 'Events & Tournaments',
    text: 'Competitive events coming soon.',
    description:
      'Seasonal events, PvP tournaments, and challenges with rewards. Stay tuned — big battles are ahead.',
    icon: '/icons/icons/features-calendar.svg',
  },
];

export default function Features() {
  return (
    <>
      <section className={styles.features}>
        <Container>
          <h2 className={styles.title}>Game Features</h2>
          <FeaturesList items={Data} />
        </Container>
      </section>

      <Divider />
    </>
  );
}
