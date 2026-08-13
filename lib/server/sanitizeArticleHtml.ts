import 'server-only';
import sanitizeHtml from 'sanitize-html';

// Дозволені теги — все, що реально приходить у content від бекенду:
// заголовки h2/h3, параграфи, списки, таблиці, посилання, базове форматування.
// Все інше (script, style, iframe, object, form) вирізається.
const ALLOWED_TAGS = [
  'h2',
  'h3',
  'h4',
  'p',
  'ul',
  'ol',
  'li',
  'strong',
  'em',
  'b',
  'i',
  'a',
  'blockquote',
  'code',
  'pre',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'br',
  'hr',
] as const;

export function sanitizeArticleHtml(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [...ALLOWED_TAGS],
    allowedAttributes: {
      a: ['href', 'title', 'rel'],
      h2: ['id'],
      h3: ['id'],
      th: ['scope', 'colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
    },
    // Дозволяємо тільки безпечні схеми в посиланнях.
    allowedSchemes: ['http', 'https', 'mailto'],
    // Розривні посилання (target=_blank) не використовуємо для внутрішньої
    // перелінковки — залишаємо клік у тому ж таба. Якщо колись з'явиться
    // зовнішнє посилання, додамо noopener окремо.
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? '';
        // Забезпечуємо, що rel носить noopener для будь-якого зовнішнього
        // (на всякий випадок, якщо в content таки з'явиться абсолютний URL).
        const isExternal = /^https?:\/\//i.test(href) && !href.startsWith('https://minecraftsgame.com');
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(isExternal ? { rel: 'noopener nofollow', target: '_blank' } : {}),
          },
        };
      },
    },
  });
}
