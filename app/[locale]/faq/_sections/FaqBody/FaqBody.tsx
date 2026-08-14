'use client';

import { Container } from '@/app/_components/Container/Container';
import Filters from '../Filters/Filters';
import FaqList from '../FaqList/FaqList';
import { useFaqPage } from '../FaqPageContext';
import FaqSidebar from './FaqSidebar';
import styles from './FaqBody.module.css';

export default function FaqBody() {
  const { activeCategory, setActiveCategory } = useFaqPage();

  return (
    <section id="faq-results" className={styles.faqBody}>
      <Container variant="faq" className={styles.shell}>
        <div className={styles.layout}>
          <FaqSidebar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

          <div className={styles.main}>
            <Filters activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            <FaqList activeCategory={activeCategory} />
          </div>
        </div>
      </Container>
    </section>
  );
}
