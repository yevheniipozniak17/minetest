// Blog API (deprod.top) — окремий сервер від нашого основного бекенду.
// Basic auth, ходимо тільки з сервера (RSC / route handlers). Токен ніколи
// не виїжджає в браузер.

export const BLOG_API_URL = process.env.BLOG_API_URL ?? 'https://deprod.top/api/v1';

// Basic auth заголовок збираємо один раз на процес.
export const BLOG_AUTH_HEADER = (() => {
  const user = process.env.BLOG_API_USER;
  const pass = process.env.BLOG_API_PASSWORD;
  if (!user || !pass) return null;
  const encoded = Buffer.from(`${user}:${pass}`).toString('base64');
  return `Basic ${encoded}`;
})();

// Одна мова блогу поки що. Коли з'являться інші — просто розширюємо тип.
export type BlogLang = 'en';
export const DEFAULT_BLOG_LANG: BlogLang = 'en';
