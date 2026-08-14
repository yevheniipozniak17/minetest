import { getTranslations } from 'next-intl/server';
import styles from './CardList.module.css';
import Card from './Card/Card';

const SERVER_DATA = [
  { image: '/about/images/1.webp', title: 'LuckySurvival', key: 'card1' },
  { image: '/about/images/2.webp', title: 'MineWars', key: 'card2' },
  { image: '/about/images/3.webp', title: 'CalmSky', key: 'card3' },
] as const;

export interface CardProps {
  image: string;
  ganre: string;
  title: string;
  description: string;
}

export default async function CardList() {
  const t = await getTranslations('marketing');

  return (
    <ul className={styles.list}>
      {SERVER_DATA.map(({ image, title, key }) => (
        <Card
          key={title}
          image={image}
          ganre={t(`about.servers.${key}Genre` as const)}
          title={title}
          description={t(`about.servers.${key}Desc` as const)}
        />
      ))}
    </ul>
  );
}
