import Image from 'next/image';
import { QuestionsCardProps } from '../Questions';
import styles from './AccordeonCard.module.css';

type AccordeonCardComponentProps = QuestionsCardProps & {
  isOpen: boolean;
  onToggle: () => void;
};

export default function AccordeonCard({
  question,
  answer,
  isOpen,
  onToggle,
}: AccordeonCardComponentProps) {
  return (
    <li className={`${styles.accordeonCard} ${isOpen ? styles.open : ''}`}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
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
