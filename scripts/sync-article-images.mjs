// Розкладає картинки статей блогу з _incoming/images у public/blog/articles.
//
// Контекст: бекенд картинки не роздає (ендпоінт /image/ віддає 404 — їх туди
// свідомо не заливали), тому ілюстрації статей живуть у нашому репозиторії.
//
// У _incoming картинки названі по cluster_id (96066.webp), але detail-відповідь
// статті cluster_id не містить — лише slug. Тому копіюємо під слагом, який
// доступний і в списку, і в статті. Мапу cluster_id → slug беремо з
// _incoming/articles/*-en.json (слаги спільні для всіх мов).
//
// За замовчуванням синхронізуємо лише ті статті, які реально є на бекенді, щоб
// не тягнути в git 128 МБ під ще не опублікований контент. --all копіює все.
//
// Використання:
//   node scripts/sync-article-images.mjs            # тільки опубліковані
//   node scripts/sync-article-images.mjs --all      # усі 1303
//   node scripts/sync-article-images.mjs --force    # перезаписати наявні
//   node scripts/sync-article-images.mjs --dry-run  # показати план без запису

import fs from 'node:fs';
import path from 'node:path';

const ARTICLES_DIR = '_incoming/articles';
const IMAGES_DIR = '_incoming/images';
const OUT_DIR = 'public/blog/articles';
const MANIFEST = 'app/[locale]/blog/_articleImages.ts';

const args = process.argv.slice(2);
const flags = {
  all: args.includes('--all'),
  force: args.includes('--force'),
  dryRun: args.includes('--dry-run'),
};

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

// cluster_id → slug з локальних EN-файлів статей.
function buildClusterToSlug() {
  const files = fs.readdirSync(ARTICLES_DIR).filter(name => name.endsWith('-en.json'));
  const map = new Map();
  const slugSeen = new Map();

  for (const file of files) {
    const article = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8'));
    const clusterId = String(article.cluster_id);
    const { slug } = article;
    if (!clusterId || !slug) continue;

    // Слаг стає імʼям файлу, тож колізія тихо перезаписала б чужу картинку.
    if (slugSeen.has(slug)) {
      throw new Error(
        `Слаг "${slug}" зустрічається двічі: cluster_id ${slugSeen.get(slug)} і ${clusterId}. ` +
          'Імена файлів були б неоднозначні — розберіться з дублем у _incoming/articles.'
      );
    }
    slugSeen.set(slug, clusterId);
    map.set(clusterId, slug);
  }

  return map;
}

async function fetchPublishedSlugs(env) {
  const base = env.BLOG_API_URL ?? 'https://deprod.top/api/v1';
  const user = env.BLOG_API_USER;
  const pass = env.BLOG_API_PASSWORD;
  const headers = user && pass
    ? { Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}` }
    : {};

  // Слаги однакові для всіх мов, тому одного запиту достатньо.
  const res = await fetch(`${base}/blog/en/articles/slugs/`, { headers });
  if (!res.ok) throw new Error(`Blog API /articles/slugs/ → ${res.status}`);
  return new Set(await res.json());
}

function writeManifest(slugs) {
  const sorted = [...slugs].sort();
  const body = sorted.map(slug => `  '${slug}',`).join('\n');
  const contents = `// ЗГЕНЕРОВАНО scripts/sync-article-images.mjs — не редагувати вручну.
//
// Слаги статей, для яких у public/blog/articles лежить картинка. Адаптер
// звіряється з цим списком, щоб не віддавати <Image> шлях до неіснуючого
// файлу: доки бекенд і наш репозиторій розʼїжджаються за складом статей,
// без такої перевірки на карточках зʼявляються биті плейсхолдери.

export const ARTICLE_IMAGE_SLUGS: ReadonlySet<string> = new Set([
${body}
]);
`;

  if (flags.dryRun) {
    console.log(`\n[dry-run] маніфест ${MANIFEST}: ${sorted.length} слаг(ів)`);
    return;
  }
  fs.writeFileSync(MANIFEST, contents);
  console.log(`\nМаніфест ${MANIFEST}: ${sorted.length} слаг(ів)`);
}

async function main() {
  for (const dir of [ARTICLES_DIR, IMAGES_DIR]) {
    if (!fs.existsSync(dir)) {
      console.error(`Немає ${dir}. Скрипт працює з розпакованою вигрузкою контенту.`);
      process.exit(1);
    }
  }

  const clusterToSlug = buildClusterToSlug();
  console.log(`Локальних статей (EN): ${clusterToSlug.size}`);

  let wanted;
  if (flags.all) {
    wanted = null;
    console.log('Режим --all: копіюємо всі картинки.');
  } else {
    wanted = await fetchPublishedSlugs(readEnvLocal());
    console.log(`Опубліковано на бекенді: ${wanted.size}`);
  }

  if (!flags.dryRun) fs.mkdirSync(OUT_DIR, { recursive: true });

  const stats = { copied: 0, skipped: 0, missingImage: [], notInLocal: [] };
  const present = new Set();

  for (const [clusterId, slug] of clusterToSlug) {
    if (wanted && !wanted.has(slug)) continue;

    const src = path.join(IMAGES_DIR, `${clusterId}.webp`);
    const dest = path.join(OUT_DIR, `${slug}.webp`);

    if (!fs.existsSync(src)) {
      stats.missingImage.push(`${slug} (cluster_id ${clusterId})`);
      continue;
    }

    present.add(slug);

    if (fs.existsSync(dest) && !flags.force) {
      stats.skipped += 1;
      continue;
    }

    if (!flags.dryRun) fs.copyFileSync(src, dest);
    stats.copied += 1;
  }

  // Статті, що є на бекенді, але яких немає у локальній вигрузці — саме вони
  // залишаться без картинки на сайті.
  if (wanted) {
    const localSlugs = new Set(clusterToSlug.values());
    for (const slug of wanted) if (!localSlugs.has(slug)) stats.notInLocal.push(slug);
  }

  // Уже наявні у public файли теж потрапляють у маніфест: інакше повторний
  // запуск без --force звузив би список до щойно скопійованих.
  if (fs.existsSync(OUT_DIR)) {
    for (const name of fs.readdirSync(OUT_DIR)) {
      if (name.endsWith('.webp')) present.add(name.slice(0, -'.webp'.length));
    }
  }

  writeManifest(present);

  const bytes = [...present].reduce((sum, slug) => {
    const file = path.join(OUT_DIR, `${slug}.webp`);
    return sum + (fs.existsSync(file) ? fs.statSync(file).size : 0);
  }, 0);

  console.log(`\nСкопійовано: ${stats.copied}${flags.dryRun ? ' (dry-run)' : ''}`);
  console.log(`Пропущено (вже є): ${stats.skipped}`);
  console.log(`Разом у ${OUT_DIR}: ${present.size} файл(ів), ${(bytes / 1024 / 1024).toFixed(1)} МБ`);

  if (stats.missingImage.length) {
    console.log(`\nБез картинки у _incoming/images (${stats.missingImage.length}):`);
    for (const item of stats.missingImage.slice(0, 20)) console.log('  -', item);
    if (stats.missingImage.length > 20) console.log(`  ... і ще ${stats.missingImage.length - 20}`);
  }

  if (stats.notInLocal.length) {
    console.log(`\nЄ на бекенді, немає у вигрузці (${stats.notInLocal.length}) — будуть без картинки:`);
    for (const slug of stats.notInLocal.slice(0, 20)) console.log('  -', slug);
    if (stats.notInLocal.length > 20) console.log(`  ... і ще ${stats.notInLocal.length - 20}`);
  }
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
