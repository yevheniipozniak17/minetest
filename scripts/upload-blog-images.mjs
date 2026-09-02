// Заливає ілюстрації статей блогу на сервер, у каталог поза репозиторієм.
//
// Навіщо: у git картинки не тримаємо (1303 статті ≈ 128 МБ, і бінарники з
// історії вже не прибрати), а Next не віддає файли, підкладені в public/ після
// збірки. Тому вони живуть окремим каталогом на сервері, звідки їх читає
// app/blog-image/[file]/route.ts на кожен запит.
//
// У _incoming картинки названі по cluster_id (96215.webp), а в рантаймі ми
// знаємо лише слаг: detail-відповідь статті cluster_id не віддає. Тому тут же
// і перейменовуємо — на сервер їде вже {slug}.webp, і жодних мап у коді.
//
// Заливаємо одразу всі статті з вигрузки, а не лише опубліковані: після цього
// CMS може публікувати будь-яку з них будь-якого дня, і картинка зʼявиться
// сама, без нашої участі.
//
// Використання:
//   node scripts/upload-blog-images.mjs              # усі статті з вигрузки
//   node scripts/upload-blog-images.mjs --published   # лише опубліковані
//   node scripts/upload-blog-images.mjs --dry-run     # показати план
//
// Адреса сервера: BLOG_IMAGE_SSH_HOST / BLOG_IMAGE_SSH_USER /
// BLOG_IMAGE_REMOTE_DIR у .env.local, або прапорці --host= --user= --dir=

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ARTICLES_DIR = '_incoming/articles';
const IMAGES_DIR = '_incoming/images';
const STAGING_DIR = '.blog-images-staging';

const args = process.argv.slice(2);
const flags = {
  published: args.includes('--published'),
  dryRun: args.includes('--dry-run'),
};

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

// cluster_id → slug з локальних EN-файлів статей. Слаги спільні для всіх мов,
// тож одного проходу по *-en.json достатньо.
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
          'Розберіться з дублем у _incoming/articles.'
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
  const headers =
    user && pass
      ? { Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}` }
      : {};

  const res = await fetch(`${base}/blog/en/articles/slugs/`, { headers });
  if (!res.ok) throw new Error(`Blog API /articles/slugs/ → ${res.status}`);
  return new Set(await res.json());
}

// Готуємо каталог із файлами під слагами. Жорсткі посилання замість копій:
// 128 МБ не дублюються на диску, а для tar вони нічим не відрізняються.
function stage(clusterToSlug, wanted) {
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  fs.mkdirSync(STAGING_DIR, { recursive: true });

  const stats = { staged: 0, bytes: 0, missing: [] };

  for (const [clusterId, slug] of clusterToSlug) {
    if (wanted && !wanted.has(slug)) continue;

    const src = path.join(IMAGES_DIR, `${clusterId}.webp`);
    if (!fs.existsSync(src)) {
      stats.missing.push(`${slug} (cluster_id ${clusterId})`);
      continue;
    }

    const dest = path.join(STAGING_DIR, `${slug}.webp`);
    try {
      fs.linkSync(src, dest);
    } catch {
      fs.copyFileSync(src, dest);
    }

    stats.staged += 1;
    stats.bytes += fs.statSync(dest).size;
  }

  return stats;
}

// tar пишемо в stdout і одразу вливаємо в ssh: без проміжного архіву на диску
// і без shell-лапок, які на Windows поводяться інакше.
function transfer({ host, user, dir }) {
  return new Promise((resolve, reject) => {
    const tar = spawn('tar', ['-cf', '-', '-C', STAGING_DIR, '.']);
    const ssh = spawn('ssh', [
      '-o',
      'BatchMode=yes',
      `${user}@${host}`,
      `mkdir -p '${dir}' && tar -xf - -C '${dir}'`,
    ]);

    let stderr = '';
    tar.stderr.on('data', chunk => (stderr += chunk));
    ssh.stderr.on('data', chunk => (stderr += chunk));

    tar.stdout.pipe(ssh.stdin);
    tar.on('error', reject);
    ssh.on('error', reject);

    ssh.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`ssh завершився з кодом ${code}\n${stderr.trim()}`));
    });
  });
}

async function main() {
  for (const dir of [ARTICLES_DIR, IMAGES_DIR]) {
    if (!fs.existsSync(dir)) {
      console.error(`Немає ${dir}. Скрипт працює з розпакованою вигрузкою контенту.`);
      process.exit(1);
    }
  }

  const env = { ...readEnvLocal(), ...process.env };
  const host = flagValue('host') ?? env.BLOG_IMAGE_SSH_HOST;
  const user = flagValue('user') ?? env.BLOG_IMAGE_SSH_USER ?? 'root';
  const dir = flagValue('dir') ?? env.BLOG_IMAGE_REMOTE_DIR ?? '/var/lib/blog-images';

  if (!host && !flags.dryRun) {
    console.error(
      'Не задано сервер. Додай BLOG_IMAGE_SSH_HOST у .env.local або передай --host=<ip>.'
    );
    process.exit(1);
  }

  const clusterToSlug = buildClusterToSlug();
  console.log(`Локальних статей (EN): ${clusterToSlug.size}`);

  let wanted = null;
  if (flags.published) {
    wanted = await fetchPublishedSlugs(env);
    console.log(`Режим --published: опубліковано на бекенді ${wanted.size}`);
  }

  const stats = stage(clusterToSlug, wanted);
  const megabytes = (stats.bytes / 1024 / 1024).toFixed(1);
  console.log(`Підготовано: ${stats.staged} файл(ів), ${megabytes} МБ`);

  if (stats.missing.length) {
    console.log(`\nБез картинки у ${IMAGES_DIR} (${stats.missing.length}):`);
    for (const item of stats.missing.slice(0, 20)) console.log('  -', item);
    if (stats.missing.length > 20) console.log(`  ... і ще ${stats.missing.length - 20}`);
  }

  if (flags.dryRun) {
    console.log(`\n[dry-run] залив би у ${user}@${host ?? '<host>'}:${dir}`);
    fs.rmSync(STAGING_DIR, { recursive: true, force: true });
    return;
  }

  console.log(`\nЗаливаю у ${user}@${host}:${dir} ...`);
  await transfer({ host, user, dir });
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  console.log('Готово.');
}

main().catch(err => {
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  console.error(err.message);
  process.exit(1);
});
