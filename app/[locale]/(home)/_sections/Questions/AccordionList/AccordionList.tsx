'use client';

import { useState } from 'react';
import AccordionCard from '../AccordionCard/AccordionCard';
import type { QuestionsCardProps } from '../Questions';
import styles from './AccordionList.module.css';

export type QuestionsListProps = {
  items: QuestionsCardProps[];
};

export default function AccordeonList({ items }: QuestionsListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <ul className={styles.accordionList}>
      {items.map((item, index) => (
        <AccordionCard
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
