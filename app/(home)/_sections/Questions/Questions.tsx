import { Container } from '@/app/_components/Container/Container';
import AccordionList from './AccordionList/AccordionList';
import styles from './Questions.module.css';

export type QuestionsCardProps = {
  question: string;
  answer: string;
};

const Data: QuestionsCardProps[] = [
  {
    question: 'How do I start playing?',
    answer: 'Create an account, choose a server, and connect using the IP address.',
  },
  {
    question: 'Can I play on multiple servers?',
    answer: 'An active community playing daily across all servers.',
  },
  {
    question: 'Do you support Java Edition?',
    answer: 'Moderation, support, and development always online.',
  },
  {
    question: 'How do I contact support?',
    answer: 'New features, fixes, and improvements every month.',
  },
  {
    question: 'Are events free to join?',
    answer: 'No pay-to-win. Balance comes first.',
  },
];

export default function Questions() {
  return (
    <section className={styles.questionsSection}>
      <Container>
        <div className={styles.questionsContainer}>
          <div>
            <h2 className={styles.title}>Frequently Asked Questions</h2>
            <p className={styles.text}>
              Didn&apos;t find the answer to your question? Go to the FAQ page
            </p>

            <button className={styles.button}>See More</button>
          </div>
          <AccordionList items={Data} />
        </div>
      </Container>
    </section>
  );
}
