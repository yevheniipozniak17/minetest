#!/usr/bin/env node
/**
 * Batch-translate blog articles from _incoming/articles/ → _incoming/translations/{lang}/
 *
 * Usage:
 *   node scripts/translate-articles.mjs --lang de --limit 3
 *   node scripts/translate-articles.mjs --lang de --resume
 *   node scripts/translate-articles.mjs --all --resume
 *   node scripts/translate-articles.mjs --lang de --limit 1 --dry-run
 *   node scripts/translate-articles.mjs --lang de --provider google
 *
 * Env:
 *   OPENAI_API_KEY   required for --provider openai (default)
 *   OPENAI_MODEL     optional, default gpt-4o-mini
 *   TRANSLATE_CONCURRENCY  optional, default 3
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, '_incoming', 'articles');
const OUT_ROOT = path.join(ROOT, '_incoming', 'translations');
const PROGRESS_FILE = path.join(OUT_ROOT, '.progress.json');
const ERRORS_FILE = path.join(OUT_ROOT, '.errors.log');

const TARGET_LANGS = ['de', 'fr', 'es', 'it', 'pl'];
const LANG_NAMES = {
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  pl: 'Polish',
};

const TRANSLATE_FIELDS = [
  'title',
  'seo_title',
  'seo_description',
  'short_content',
  'content',
];

const GLOSSARY = `
Keep these terms UNTRANSLATED (or use the official Minecraft localization if widely known):
Java Edition, Bedrock Edition, Bedrock, Minecraft, MineWars, LuckySurvival, CalmSky,
Realms, Nether, End, Overworld, Redstone, Pickaxe, Silk Touch, Fortune, FOV, DPI,
Y-level coordinates like Y=232, IP addresses, port numbers (25565, 19132),
URLs, HTML tag names and attributes, brand names.
Do NOT translate slug-like identifiers. Preserve all HTML tags and attributes exactly.
`.trim();

function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

function parseArgs(argv) {
  const args = {
    langs: [],
    all: false,
    resume: false,
    dryRun: false,
    limit: Infinity,
    concurrency: Number(process.env.TRANSLATE_CONCURRENCY || 3),
    provider: 'openai',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    ids: [],
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--all') args.all = true;
    else if (a === '--resume') args.resume = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--lang') args.langs.push(argv[++i]);
    else if (a === '--limit') args.limit = Number(argv[++i]);
    else if (a === '--concurrency') args.concurrency = Number(argv[++i]);
    else if (a === '--provider') args.provider = argv[++i];
    else if (a === '--model') args.model = argv[++i];
    else if (a === '--id') args.ids.push(String(argv[++i]));
    else if (a === '--help' || a === '-h') args.help = true;
  }

  if (args.all) args.langs = [...TARGET_LANGS];
  args.langs = [...new Set(args.langs.filter(Boolean))];
  return args;
}

function usage() {
  console.log(`Usage:
  node scripts/translate-articles.mjs --lang de [--limit N] [--resume] [--dry-run]
  node scripts/translate-articles.mjs --all --resume
  node scripts/translate-articles.mjs --lang de --provider google
`);
}

function ensureDirs(langs) {
  fs.mkdirSync(OUT_ROOT, { recursive: true });
  for (const lang of langs) {
    fs.mkdirSync(path.join(OUT_ROOT, lang), { recursive: true });
  }
}

function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) {
    return { completed: {}, failed: {}, updated_at: null };
  }
  return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
}

function saveProgress(progress) {
  let existing = { completed: {}, failed: {} };
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      existing = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    } catch {
      // A concurrent process can briefly hold an incomplete file; our in-memory
      // checkpoint is still valid and will replace it.
    }
  }

  const merged = {
    completed: {
      ...(existing.completed ?? {}),
      ...(progress.completed ?? {}),
    },
    failed: {
      ...(existing.failed ?? {}),
      ...(progress.failed ?? {}),
    },
    updated_at: new Date().toISOString(),
  };

  for (const key of Object.keys(merged.completed)) {
    delete merged.failed[key];
  }

  Object.assign(progress, merged);
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(merged, null, 2));
}

function logError(line) {
  fs.appendFileSync(ERRORS_FILE, `${new Date().toISOString()} ${line}\n`);
}

function listArticles() {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const full = path.join(ARTICLES_DIR, f);
      const raw = JSON.parse(fs.readFileSync(full, 'utf8'));
      return {
        file: f,
        cluster_id: raw.cluster_id,
        priority: Number(raw.priority ?? 0),
        raw,
      };
    })
    .sort((a, b) => b.priority - a.priority);
}

function extractTags(html) {
  const tags = [];
  const re = /<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g;
  let m;
  while ((m = re.exec(html))) tags.push(m[1].toLowerCase());
  return tags;
}

function tagsMatch(sourceHtml, translatedHtml) {
  const a = extractTags(sourceHtml);
  const b = extractTags(translatedHtml);
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function tagCountsMatch(sourceHtml, translatedHtml) {
  const count = html => {
    const map = new Map();
    for (const t of extractTags(html)) map.set(t, (map.get(t) || 0) + 1);
    return map;
  };
  const a = count(sourceHtml);
  const b = count(translatedHtml);
  if (a.size !== b.size) return false;
  for (const [key, value] of a) {
    if (b.get(key) !== value) return false;
  }
  return true;
}

function htmlQuality(sourceHtml, translatedHtml) {
  const srcN = extractTags(sourceHtml).length;
  const outN = extractTags(translatedHtml).length;
  if (srcN === 0) return { ok: true, soft: false };
  if (tagsMatch(sourceHtml, translatedHtml)) return { ok: true, soft: false };
  if (tagCountsMatch(sourceHtml, translatedHtml)) return { ok: true, soft: true };
  const ratio = outN / srcN;
  if (ratio >= 0.9 && ratio <= 1.1) return { ok: true, soft: true };
  return { ok: false, soft: false };
}

/** Replace HTML tags with stable placeholders so Google Translate won't mangle them. */
function protectHtml(html) {
  const tags = [];
  const protectedText = String(html).replace(/<[^>]+>/g, match => {
    const idx = tags.length;
    tags.push(match);
    // Private-use codepoints — rarely altered by MT engines
    return `\uE000${idx}\uE001`;
  });
  return { protectedText, tags };
}

function restoreHtml(text, tags) {
  return String(text)
    .replace(/\uE000(\d+)\uE001/g, (_, n) => tags[Number(n)] ?? '')
    // Fallbacks if the engine normalizes private-use chars
    .replace(/\{\{\s*T\s*(\d+)\s*\}\}/gi, (_, n) => tags[Number(n)] ?? '')
    .replace(/<<<\s*(\d+)\s*>>>/g, (_, n) => tags[Number(n)] ?? '');
}

function buildPayload(article) {
  return {
    title: article.title,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    short_content: article.short_content,
    content: article.content,
    faq: (article.faq || []).map(item => ({
      question: item.question,
      answer: item.answer,
    })),
    cta: {
      headline: article.cta?.headline ?? '',
      text: article.cta?.text ?? '',
      button_label: article.cta?.button_label ?? '',
    },
  };
}

function mergeTranslation(source, translated, lang, model) {
  const out = structuredClone(source);
  for (const key of TRANSLATE_FIELDS) {
    if (typeof translated[key] === 'string') out[key] = translated[key];
  }
  if (Array.isArray(translated.faq) && Array.isArray(out.faq)) {
    out.faq = out.faq.map((item, i) => ({
      ...item,
      question: translated.faq[i]?.question ?? item.question,
      answer: translated.faq[i]?.answer ?? item.answer,
    }));
  }
  if (translated.cta && out.cta) {
    out.cta = {
      ...out.cta,
      headline: translated.cta.headline ?? out.cta.headline,
      text: translated.cta.text ?? out.cta.text,
      button_label: translated.cta.button_label ?? out.cta.button_label,
    };
  }
  out.translation_meta = {
    source_cluster_id: source.cluster_id,
    source_lang: 'en',
    target_lang: lang,
    translated_at: new Date().toISOString(),
    model,
    ...(translated.__htmlSoft ? { html_soft_match: true } : {}),
  };
  return out;
}

function validateTranslation(source, translated) {
  const errors = [];
  for (const key of TRANSLATE_FIELDS) {
    if (!translated[key] || typeof translated[key] !== 'string') {
      errors.push(`missing field: ${key}`);
    }
  }
  if (!Array.isArray(translated.faq) || translated.faq.length !== (source.faq?.length ?? 0)) {
    errors.push(`faq length mismatch`);
  }
  if (translated.content) {
    const quality = htmlQuality(source.content, translated.content);
    if (!quality.ok) errors.push('HTML tag structure mismatch in content');
    else translated.__htmlSoft = quality.soft;
  }
  if (translated.content && translated.content.length < source.content.length * 0.3) {
    errors.push('translated content suspiciously short');
  }
  return errors;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function withBackoff(fn, { retries = 6, label = 'request' } = {}) {
  let delay = 1000;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = err.status || err.statusCode;
      const retryable = status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
      if (!retryable || attempt === retries) throw err;
      const wait = delay + Math.floor(Math.random() * 250);
      console.warn(`  retry ${attempt + 1}/${retries} for ${label} after ${wait}ms (${err.message})`);
      await sleep(wait);
      delay = Math.min(delay * 2, 60000);
    }
  }
}

async function translateWithOpenAI(payload, lang, model, apiKey) {
  const system = `You are a professional game-localization translator for Minecraft guides.
Translate the JSON values from English to ${LANG_NAMES[lang]} (${lang}).
Return ONLY valid JSON with the exact same keys and array lengths.
Preserve all HTML tags/attributes in "content" exactly — translate text nodes only.
${GLOSSARY}`;

  const user = JSON.stringify(payload);

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: `Translate this JSON object. Keep structure identical.\n\n${user}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    const err = new Error(`OpenAI ${res.status}: ${body.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty OpenAI response');
  return JSON.parse(text);
}

/** Free Google Translate endpoint (unofficial). Used when OPENAI_API_KEY is absent. */
async function googleTranslateText(text, lang, { isHtml = false } = {}) {
  if (!text) return text;

  let working = text;
  let tags = null;
  if (isHtml) {
    ({ protectedText: working, tags } = protectHtml(text));
  }

  // Chunk long text to stay under URL limits
  const chunks = chunkText(working, 3500);
  const out = [];
  for (const chunk of chunks) {
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.set('client', 'gtx');
    url.searchParams.set('sl', 'en');
    url.searchParams.set('tl', lang);
    url.searchParams.set('dt', 't');
    url.searchParams.set('q', chunk);

    const translated = await withBackoff(async () => {
      const res = await fetch(url);
      if (!res.ok) {
        const err = new Error(`Google Translate ${res.status}`);
        err.status = res.status;
        throw err;
      }
      const data = await res.json();
      if (!Array.isArray(data?.[0])) throw new Error('Unexpected Google Translate response');
      return data[0].map(row => row[0]).join('');
    }, { label: 'google' });

    out.push(translated);
    await sleep(80);
  }

  const joined = out.join('');
  return tags ? restoreHtml(joined, tags) : joined;
}

/**
 * Translate HTML text nodes in batches while copying tags byte-for-byte.
 * This is slower than translating protected full HTML, but guarantees that
 * Google Translate cannot drop, reorder, or rewrite markup.
 */
async function googleTranslateHtml(html, lang) {
  const tokens = String(html).split(/(<[^>]+>)/g);
  const textIndexes = tokens
    .map((token, index) => ({ token, index }))
    .filter(({ token }) => token && !token.startsWith('<') && token.trim());

  const batches = [];
  let batch = [];
  let batchLength = 0;

  for (const item of textIndexes) {
    const estimated = item.token.length + 16;
    if (batch.length && batchLength + estimated > 3200) {
      batches.push(batch);
      batch = [];
      batchLength = 0;
    }
    batch.push(item);
    batchLength += estimated;
  }
  if (batch.length) batches.push(batch);

  for (const items of batches) {
    const payload = items
      .map((item, index) => `\uE100${index}\uE101${item.token}`)
      .join('');
    const translated = await googleTranslateText(payload, lang);
    const marker = /\uE100(\d+)\uE101/g;
    const matches = [...translated.matchAll(marker)];

    if (matches.length !== items.length) {
      // Conservative fallback: translate nodes one by one.
      for (const item of items) {
        tokens[item.index] = await googleTranslateText(item.token, lang);
      }
      continue;
    }

    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index + matches[i][0].length;
      const end = matches[i + 1]?.index ?? translated.length;
      const itemIndex = Number(matches[i][1]);
      tokens[items[itemIndex].index] = translated.slice(start, end);
    }
  }

  return tokens.join('');
}

function chunkText(text, maxLen) {
  if (text.length <= maxLen) return [text];
  const parts = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + maxLen, text.length);
    if (end < text.length) {
      const slice = text.slice(i, end);
      const breakAt = Math.max(
        slice.lastIndexOf('\uE001'),
        slice.lastIndexOf('. '),
        slice.lastIndexOf(' '),
      );
      if (breakAt > maxLen * 0.5) {
        end = i + breakAt + (slice[breakAt] === '\uE001' ? 1 : 1);
      }
    }
    if (end <= i) end = Math.min(i + maxLen, text.length);
    parts.push(text.slice(i, end));
    i = end;
  }
  return parts;
}

async function translateWithGoogle(payload, lang) {
  const result = {
    title: await googleTranslateText(payload.title, lang),
    seo_title: await googleTranslateText(payload.seo_title, lang),
    seo_description: await googleTranslateText(payload.seo_description, lang),
    short_content: await googleTranslateText(payload.short_content, lang),
    content: await googleTranslateHtml(payload.content, lang),
    faq: [],
    cta: {
      headline: await googleTranslateText(payload.cta.headline, lang),
      text: await googleTranslateText(payload.cta.text, lang),
      button_label: await googleTranslateText(payload.cta.button_label, lang),
    },
  };
  for (const item of payload.faq) {
    result.faq.push({
      question: await googleTranslateText(item.question, lang),
      answer: await googleTranslateText(item.answer, lang),
    });
  }
  return result;
}

async function translateArticle(article, lang, args, apiKey) {
  const payload = buildPayload(article);
  if (args.dryRun) {
    return mergeTranslation(article, payload, lang, 'dry-run');
  }

  let translated;
  let modelLabel;
  if (args.provider === 'google') {
    translated = await translateWithGoogle(payload, lang);
    modelLabel = 'google-translate-gtx';
  } else {
    translated = await withBackoff(
      () => translateWithOpenAI(payload, lang, args.model, apiKey),
      { label: `openai:${article.cluster_id}:${lang}` },
    );
    modelLabel = args.model;
  }

  const errors = validateTranslation(article, translated);
  if (errors.length) {
    // One retry with OpenAI only; for Google, retry once more
    if (args.provider === 'openai') {
      translated = await withBackoff(
        () => translateWithOpenAI(payload, lang, args.model, apiKey),
        { label: `openai-retry:${article.cluster_id}:${lang}` },
      );
    } else {
      translated = await translateWithGoogle(payload, lang);
    }
    const errors2 = validateTranslation(article, translated);
    if (errors2.length) {
      throw new Error(`Validation failed: ${errors2.join('; ')}`);
    }
  }

  return mergeTranslation(article, translated, lang, modelLabel);
}

async function runPool(items, concurrency, worker) {
  let index = 0;
  const results = [];
  async function next() {
    while (index < items.length) {
      const i = index++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => next()));
  return results;
}

async function main() {
  loadEnvLocal();
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args.langs.length === 0) {
    usage();
    process.exit(args.help ? 0 : 1);
  }

  for (const lang of args.langs) {
    if (!TARGET_LANGS.includes(lang)) {
      console.error(`Unsupported lang: ${lang}. Use: ${TARGET_LANGS.join(', ')}`);
      process.exit(1);
    }
  }

  let apiKey = process.env.OPENAI_API_KEY || '';
  if (args.provider === 'openai' && !args.dryRun && !apiKey) {
    console.warn('OPENAI_API_KEY not set — falling back to --provider google');
    args.provider = 'google';
  }

  ensureDirs(args.langs);
  const articles = listArticles().filter(a =>
    args.ids.length === 0 || args.ids.includes(String(a.cluster_id)),
  );
  const progress = loadProgress();
  if (!progress.completed) progress.completed = {};
  if (!progress.failed) progress.failed = {};

  /** @type {{ article: any, lang: string }[]} */
  const jobs = [];
  for (const article of articles) {
    for (const lang of args.langs) {
      const outPath = path.join(OUT_ROOT, lang, `${article.cluster_id}.json`);
      const key = `${lang}:${article.cluster_id}`;
      if (args.resume && fs.existsSync(outPath)) continue;
      jobs.push({ article: article.raw, lang, outPath, key });
    }
  }

  const limited = jobs.slice(0, Number.isFinite(args.limit) ? args.limit : jobs.length);
  console.log(
    `Articles: ${articles.length} | Jobs queued: ${limited.length}/${jobs.length} | langs=${args.langs.join(',')} | provider=${args.provider} | concurrency=${args.concurrency}`,
  );

  let ok = 0;
  let fail = 0;
  let done = 0;

  await runPool(limited, args.concurrency, async job => {
    const label = `${job.lang}/${job.article.cluster_id}`;
    try {
      const result = await translateArticle(job.article, job.lang, args, apiKey);
      if (!args.dryRun) {
        fs.writeFileSync(job.outPath, JSON.stringify(result, null, 2));
      }
      progress.completed[job.key] = new Date().toISOString();
      delete progress.failed[job.key];
      ok++;
      done++;
      if (done % 5 === 0 || done === limited.length) {
        saveProgress(progress);
        const pct = ((done / limited.length) * 100).toFixed(1);
        console.log(`[${pct}%] ok=${ok} fail=${fail} last=${label}`);
      } else {
        console.log(`✓ ${label}`);
      }
    } catch (err) {
      fail++;
      done++;
      progress.failed[job.key] = err.message;
      logError(`${label} ${err.message}`);
      saveProgress(progress);
      console.error(`✗ ${label}: ${err.message}`);
    }
  });

  saveProgress(progress);
  console.log(`Done. ok=${ok} fail=${fail} provider=${args.provider}`);
  if (fail > 0) process.exitCode = 1;
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
