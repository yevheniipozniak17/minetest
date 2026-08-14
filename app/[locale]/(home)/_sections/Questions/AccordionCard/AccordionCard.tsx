import Image from 'next/image';
import { QuestionsCardProps } from '../Questions';
import styles from './AccordionCard.module.css';

type AccordionCardComponentProps = QuestionsCardProps & {
  isOpen: boolean;
  onToggle: () => void;
};

export default function AccordionCard({
  question,
  answer,
  isOpen,
  onToggle,
}: AccordionCardComponentProps) {
  return (
    <li className={`${styles.accordionCard} ${isOpen ? styles.open : ''}`}>
      <button type="button" className={styles.toggle} aria-expanded={isOpen} onClick={onToggle}>
        <h3 className={styles.title}>{question}</h3>
        <Image
          className={styles.icon}
          src={isOpen ? '/icons/icons/button-up.svg' : '/icons/icons/button-down.svg'}
          alt=""
          width={32}
          height={32}
          aria-hidden="true"
        />
      </button>
      <div className={styles.answerWrapper}>
        <p className={styles.answer}>{answer}</p>
      </div>
    </li>
  );
}
