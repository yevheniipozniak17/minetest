// Розкладає ілюстрації статей із пакетів, які контентники заливають по SFTP.
//
// Контракт із контентниками: кладуть архів вигрузки (zip або tar.gz) у
// приймальню на сервері — той самий архів, що раніше приїжджав на локальну
// машину. Більше від них нічого не потрібно.
//
// Скрипт дістає з архіву мапу cluster_id → slug (з файлів articles/*-en.json)
// і розкладає images/{cluster_id}.webp у сховище під імʼям {slug}.webp: у
// рантаймі відомий саме слаг, бо detail-відповідь статті cluster_id не віддає.
// Далі картинку вже сам віддає app/blog-image/[file]/route.ts.
//
// Запускається з cron. Архів, який ще заливається, має свіжий mtime, тому
// беремо лише ті, що не змінювались останні SETTLE_MS — інакше розпакували б
// половину файлу.
//
// Використання:
//   node scripts/intake-blog-images.mjs
//   node scripts/intake-blog-images.mjs --force     # перезаписати наявні
//   node scripts/intake-blog-images.mjs --dry-run   # лише показати план

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const INTAKE_DIR = process.env.BLOG_INTAKE_DIR ?? '/var/lib/blog-intake/upload';
const IMAGE_DIR = process.env.BLOG_IMAGE_DIR ?? '/var/lib/blog-images';
const PROCESSED_DIR = process.env.BLOG_PROCESSED_DIR ?? '/var/lib/blog-processed';

const LOCK_FILE = path.join(os.tmpdir(), 'intake-blog-images.lock');
const STALE_LOCK_MS = 60 * 60 * 1000;
const SETTLE_MS = 2 * 60 * 1000;

const ARCHIVE_EXT = ['.zip', '.tar.gz', '.tgz', '.tar'];
const IMAGE_NAME = /^(\d+)\.webp$/;

const flags = {
  force: process.argv.includes('--force'),
  dryRun: process.argv.includes('--dry-run'),
};

function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Cron може накласти запуски, якщо попередній ще розпаковує великий архів.
function acquireLock() {
  if (fs.existsSync(LOCK_FILE)) {
    const age = Date.now() - fs.statSync(LOCK_FILE).mtimeMs;
    if (age < STALE_LOCK_MS) return false;
    log(`Знімаю застарілий лок (${Math.round(age / 60000)} хв)`);
    fs.rmSync(LOCK_FILE, { force: true });
  }
  fs.writeFileSync(LOCK_FILE, String(process.pid));
  return true;
}

function archiveKind(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith('.zip')) return 'zip';
  if (lower.endsWith('.tar.gz') || lower.endsWith('.tgz')) return 'targz';
  if (lower.endsWith('.tar')) return 'tar';
  return null;
}

function extract(archive, dest) {
  const kind = archiveKind(archive);
  fs.mkdirSync(dest, { recursive: true });

  if (kind === 'zip') execFileSync('unzip', ['-q', '-o', archive, '-d', dest]);
  else if (kind === 'targz') execFileSync('tar', ['-xzf', archive, '-C', dest]);
  else execFileSync('tar', ['-xf', archive, '-C', dest]);
}

// Службові файли Mac-архівів (__MACOSX, ._foo) тільки заплутали б розбір.
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '__MACOSX' || entry.name.startsWith('._')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// Структуру архіву не припускаємо: шукаємо потрібні файли по всьому дереву,
// бо вигрузка приїжджала і плоскою, і вкладеною в теку з датою.
function buildClusterToSlug(files) {
  const map = new Map();
  const slugSeen = new Map();

  for (const file of files) {
    if (!file.endsWith('-en.json')) continue;

    let article;
    try {
      article = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      log(`  ! не читається як JSON: ${path.basename(file)}`);
      continue;
    }

    const clusterId = article?.cluster_id ? String(article.cluster_id) : null;
    const slug = article?.slug;
    if (!clusterId || !slug) continue;

    // Слаг стає імʼям файлу, тож дубль перезаписав би чужу картинку. У cron
    // падати через це не варто — просто пропускаємо і повідомляємо.
    if (slugSeen.has(slug) && slugSeen.get(slug) !== clusterId) {
      log(`  ! дубль слага "${slug}": cluster_id ${slugSeen.get(slug)} і ${clusterId} — пропускаю`);
      continue;
    }

    slugSeen.set(slug, clusterId);
    map.set(clusterId, slug);
  }

  return map;
}

function collectImages(files) {
  const map = new Map();
  for (const file of files) {
    const match = IMAGE_NAME.exec(path.basename(file));
    if (match) map.set(match[1], file);
  }
  return map;
}

function placeImages(clusterToSlug, images) {
  const stats = { placed: 0, skipped: 0, noImage: 0, noArticle: 0 };

  for (const [clusterId, slug] of clusterToSlug) {
    const src = images.get(clusterId);
    if (!src) {
      stats.noImage += 1;
      continue;
    }

    const dest = path.join(IMAGE_DIR, `${slug}.webp`);
    if (fs.existsSync(dest) && !flags.force) {
      stats.skipped += 1;
      continue;
    }

    if (!flags.dryRun) {
      fs.copyFileSync(src, dest);
      fs.chmodSync(dest, 0o644);
    }
    stats.placed += 1;
  }

  for (const clusterId of images.keys()) {
    if (!clusterToSlug.has(clusterId)) stats.noArticle += 1;
  }

  return stats;
}

function processArchive(archive) {
  log(`Пакет: ${path.basename(archive)}`);
  const workDir = fs.mkdtempSync(path.join(PROCESSED_DIR, 'unpack-'));

  try {
    extract(archive, workDir);
    const files = walk(workDir);
    const clusterToSlug = buildClusterToSlug(files);
    const images = collectImages(files);

    log(`  статей: ${clusterToSlug.size}, картинок: ${images.size}`);

    if (clusterToSlug.size === 0) {
      log('  ! у пакеті немає articles/*-en.json — без них не зіставити слаги');
      return false;
    }

    const stats = placeImages(clusterToSlug, images);
    log(
      `  розкладено: ${stats.placed}, уже було: ${stats.skipped}, ` +
        `без картинки: ${stats.noImage}, картинок без статті: ${stats.noArticle}`
    );
    return true;
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}

function main() {
  for (const dir of [INTAKE_DIR, IMAGE_DIR, PROCESSED_DIR]) {
    if (!fs.existsSync(dir)) {
      log(`Немає каталогу ${dir}`);
      process.exit(1);
    }
  }

  if (!acquireLock()) {
    log('Попередній запуск ще працює — виходжу');
    return;
  }

  try {
    const archives = fs
      .readdirSync(INTAKE_DIR)
      .filter(name => ARCHIVE_EXT.some(ext => name.toLowerCase().endsWith(ext)))
      .map(name => path.join(INTAKE_DIR, name))
      .filter(file => {
        const quiet = Date.now() - fs.statSync(file).mtimeMs > SETTLE_MS;
        if (!quiet) log(`Пропускаю ${path.basename(file)} — схоже, ще заливається`);
        return quiet;
      });

    if (archives.length === 0) return;

    log(`Знайдено пакетів: ${archives.length}`);

    for (const archive of archives) {
      let handled = false;
      try {
        handled = processArchive(archive);
      } catch (err) {
        log(`  ! помилка обробки: ${err.message}`);
      }

      if (handled && !flags.dryRun) {
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        fs.renameSync(archive, path.join(PROCESSED_DIR, `${stamp}-${path.basename(archive)}`));
        log('  пакет перенесено в оброблені');
      }
    }
  } finally {
    fs.rmSync(LOCK_FILE, { force: true });
  }
}

main();
