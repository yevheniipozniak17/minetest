import { sanitizeArticleHtml } from '@/lib/server/sanitizeArticleHtml';
import styles from './ArticleContent.module.css';

// Рендерить санітаризований HTML з бекенду. Використовує наш prose-клас,
// щоб типографіка бекенд-контенту вписувалась у дизайн сайту.
//
// dangerouslySetInnerHTML тут безпечний, бо санітайз відбувається за один крок
// вище (server-side) з жорстким whitelist тегів і атрибутів.

interface ArticleContentProps {
  html: string;
}

export default function ArticleContent({ html }: ArticleContentProps) {
  const clean = sanitizeArticleHtml(html);
  return <div className={styles.prose} dangerouslySetInnerHTML={{ __html: clean }} />;
}
