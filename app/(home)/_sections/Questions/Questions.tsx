import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import AccordionList from './AccordionList/AccordionList';
import styles from './Questions.module.css';

export type QuestionsCardProps = {
  question: string;
  answer: string;
};

// Static English data used for JSON-LD schema in page.tsx — do not translate.
export const HOME_FAQ: QuestionsCardProps[] = [
  {
    question: 'How do I start playing?',
    answer: 'Create an account, choose a server, and connect using the IP address.',
  },
  {
    question: 'Can I play on multiple servers?',
    answer: 'Yes. One account works across LuckySurvival, MineWars, and CalmSky — switch anytime.',
  },
  {
    question: 'Do you support Java Edition?',
    answer: 'Yes. We support Java 1.12.2 – 1.19 and the latest Bedrock release.',
  },
  {
    question: 'How do I contact support?',
    answer:
      'Use live chat, email, or Discord — our team replies in under 4 hours, around the clock.',
  },
  {
    question: 'Are events free to join?',
    answer:
      'Yes. Tournaments and seasonal events are free for all players — no extra purchase required.',
  },
];

export default async function Questions() {
  const t = await getTranslations('home');

  const faqItems: QuestionsCardProps[] = [
    { question: t('questions.q1.question'), answer: t('questions.q1.answer') },
    { question: t('questions.q2.question'), answer: t('questions.q2.answer') },
    { question: t('questions.q3.question'), answer: t('questions.q3.answer') },
    { question: t('questions.q4.question'), answer: t('questions.q4.answer') },
    { question: t('questions.q5.question'), answer: t('questions.q5.answer') },
  ];

  return (
    <section className={styles.questionsSection}>
      <Container>
        <div className={styles.questionsContainer}>
          <div>
            <h2 className={styles.title}>{t('questions.title')}</h2>
            <p className={styles.text}>{t('questions.text')}</p>

            <Link href="/faq" className={styles.button} aria-label={t('questions.seeMoreAriaLabel')}>
              {t('questions.seeMore')}
            </Link>
          </div>
          <AccordionList items={faqItems} />
        </div>
      </Container>
    </section>
  );
}
