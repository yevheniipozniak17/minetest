'use client';

import { useState } from 'react';
import AccordeonCard from '../AccordeonCard/AccordeonCard';
import type { QuestionsCardProps } from '../Questions';
import styles from './AccordeonList.module.css';

export type QuestionsListProps = {
  items: QuestionsCardProps[];
};

export default function AccordeonList({ items }: QuestionsListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <ul className={styles.accordeonList}>
      {items.map((item, index) => (
        <AccordeonCard
          key={item.question}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(prev => (prev === index ? null : index))}
        />
      ))}
    </ul>
  );
}
