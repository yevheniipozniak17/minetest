// Перевіряє, для яких опублікованих статей блогу на сервері немає ілюстрації.
//
// Навіщо: відсутня картинка не ламає сайт — хендлер app/blog-image віддає
// заглушку, і збій виглядає як «усе працює». Саме через цю тишу пропущену
// партію картинок можна не помітити, доки хтось не побачить однакові картки.
//
// Перевіряємо не файли по ssh, а те, що реально віддає сайт: хендлер ставить
// заголовок X-Blog-Image зі значенням hit або fallback.
//
// Використання:
//   node scripts/check-blog-images.mjs                  # прод
//   node scripts/check-blog-images.mjs --local           # localhost:3000
//   node scripts/check-blog-images.mjs --site=https://…  # довільний хост
//
// Виходить з кодом 1, якщо бракує хоч однієї картинки — щоб можна було
// поставити у CI або в cron.

import fs from 'node:fs';

const DEFAULT_SITE = 'https://minecraftsgame.com';
const CONCURRENCY = 8;

const args = process.argv.slice(2);

function flagValue(name) {
  const prefix = `--${name}=`;
  const found = args.find(arg => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

function readEnvLocal() {
  if (!fs.existsSync('.env.local')) return {};
  return Object.fromEntries(
    fs
      .readFileSync('.env.local', 'utf8')
      .split(/\r?\n/)
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => {
        const eq = line.indexOf('=');
        return [line.slice(0, eq).trim(), line.slice(eq + 1).trim()];
      })
  );
}

async function fetchPublishedSlugs(env) {
  const base = env.BLOG_API_URL ?? 'https://deprod.top/api/v1';
  const user = env.BLOG_API_USER;
  const pass = env.BLOG_API_PASSWORD;
  const headers =
    user && pass
      ? { Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}` }
      : {};

  const res = await fetch(`${base}/blog/en/articles/slugs/`, { headers });
  if (!res.ok) throw new Error(`Blog API /articles/slugs/ → ${res.status}`);
  return await res.json();
}

async function probe(site, slug) {
  const url = `${site}/blog-image/${slug}.webp`;

  let res = await fetch(url, { method: 'HEAD' });
  // Якщо HEAD не підтримано — добираємо через GET і одразу кидаємо тіло.
  if (res.status === 405) {
    res = await fetch(url);
    res.body?.cancel();
  }

  return { slug, status: res.status, kind: res.headers.get('x-blog-image') };
}

// Простий пул: 1303 паралельних запити сайт не оцінить.
async function probeAll(site, slugs) {
  const results = [];
  let cursor = 0;

  async function worker() {
    while (cursor < slugs.length) {
      const slug = slugs[cursor++];
      try {
        results.push(await probe(site, slug));
      } catch (err) {
        results.push({ slug, status: 0, kind: null, error: err.message });
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

async function main() {
  const env = { ...readEnvLocal(), ...process.env };
  const site = args.includes('--local')
    ? 'http://localhost:3000'
    : (flagValue('site') ?? env.BLOG_IMAGE_CHECK_URL ?? DEFAULT_SITE);

  const slugs = await fetchPublishedSlugs(env);
  console.log(`Опубліковано на бекенді: ${slugs.length}`);
  console.log(`Перевіряю ${site} ...\n`);

  const results = await probeAll(site, slugs);
  const missing = results.filter(r => r.kind !== 'hit');
  const hits = results.length - missing.length;

  console.log(`Своя картинка: ${hits}`);
  console.log(`Заглушка або помилка: ${missing.length}`);

  if (missing.length) {
    console.log('\nБез картинки:');
    for (const item of missing) {
      const reason = item.error ?? item.kind ?? `HTTP ${item.status}`;
      console.log(`  - ${item.slug}  (${reason})`);
    }
    console.log('\nЗалити відсутні:  node scripts/upload-blog-images.mjs');
    process.exit(1);
  }

  console.log('\nУсі опубліковані статті мають свою ілюстрацію.');
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
