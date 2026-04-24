import BenefitsCard from '../BenefitsCard/BenefitsCard';
import type { BenefitsCardProps } from '../Benefits';
import styles from './BenefitsList.module.css';

export type BenefitsListProps = {
  items: BenefitsCardProps[];
};

export default function BenefitsList({ items }: BenefitsListProps) {
  return (
    <ul className={styles.benefitsList}>
      {items.map(item => (
        <BenefitsCard key={item.title} title={item.title} text={item.text} />
      ))}
    </ul>
  );
}
