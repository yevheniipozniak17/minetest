#!/usr/bin/env node
/**
 * Validate _incoming/translations/{lang}/*.json against _incoming/articles/*.json
 *
 * Usage:
 *   node scripts/validate-translations.mjs
 *   node scripts/validate-translations.mjs --lang de
 *   node scripts/validate-translations.mjs --pair de:96519 --pair fr:96489
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, '_incoming', 'articles');
const OUT_ROOT = path.join(ROOT, '_incoming', 'translations');
const TARGET_LANGS = ['de', 'fr', 'es', 'it', 'pl'];

function parseArgs(argv) {
  const langs = [];
  const pairs = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--lang') langs.push(argv[++i]);
    else if (argv[i] === '--pair') pairs.push(argv[++i]);
  }
  return { langs: langs.length ? langs : [...TARGET_LANGS], pairs };
}

function extractTags(html) {
  const tags = [];
  const re = /<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g;
  let m;
  while ((m = re.exec(html || ''))) tags.push(m[1].toLowerCase());
  return tags;
}

function tagsMatch(a, b) {
  const ta = extractTags(a);
  const tb = extractTags(b);
  if (ta.length !== tb.length) return false;
  return ta.every((t, i) => t === tb[i]);
}

function main() {
  const { langs, pairs } = parseArgs(process.argv.slice(2));
  const sources = fs
    .readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const raw = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8'));
      return raw;
    });

  const report = {
    source_count: sources.length,
    langs: {},
    totals: { ok: 0, missing: 0, broken: 0 },
    samples: { ok: [], broken: [], missing: [] },
  };

  const sourceById = new Map(sources.map(source => [String(source.cluster_id), source]));
  const targets = pairs.length
    ? pairs.map(pair => {
        const [lang, id] = pair.split(':');
        const source = sourceById.get(String(id));
        if (!source) throw new Error(`Source article not found: ${pair}`);
        return { lang, source };
      })
    : langs.flatMap(lang => sources.map(source => ({ lang, source })));

  for (const { lang, source } of targets) {
    const dir = path.join(OUT_ROOT, lang);
    const langReport =
      report.langs[lang] ??
      (report.langs[lang] = { ok: 0, missing: 0, broken: 0, issues: [] });
      const outPath = path.join(dir, `${source.cluster_id}.json`);
      if (!fs.existsSync(outPath)) {
        langReport.missing++;
        report.totals.missing++;
        if (report.samples.missing.length < 10) {
          report.samples.missing.push(`${lang}/${source.cluster_id}`);
        }
        continue;
      }

      let translated;
      try {
        translated = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      } catch (err) {
        langReport.broken++;
        report.totals.broken++;
        langReport.issues.push({ id: source.cluster_id, error: `JSON parse: ${err.message}` });
        continue;
      }

      const problems = [];
      if (translated.cluster_id !== source.cluster_id) problems.push('cluster_id mismatch');
      if (translated.slug !== source.slug) problems.push('slug mismatch');
      if (!translated.title) problems.push('empty title');
      if (!translated.content) problems.push('empty content');
      if ((translated.faq?.length ?? 0) !== (source.faq?.length ?? 0)) problems.push('faq length');
      if (!tagsMatch(source.content, translated.content)) problems.push('HTML tags');
      if (!translated.translation_meta?.target_lang) problems.push('missing translation_meta');

      if (problems.length) {
        langReport.broken++;
        report.totals.broken++;
        langReport.issues.push({ id: source.cluster_id, error: problems.join(', ') });
        if (report.samples.broken.length < 10) {
          report.samples.broken.push(`${lang}/${source.cluster_id}: ${problems.join(', ')}`);
        }
      } else {
        langReport.ok++;
        report.totals.ok++;
        if (report.samples.ok.length < 5) {
          report.samples.ok.push(`${lang}/${source.cluster_id} — ${translated.title}`);
        }
      }
  }

  console.log(JSON.stringify(report, null, 2));
  const expected = targets.length;
  console.log(
    `\nSummary: ok=${report.totals.ok} missing=${report.totals.missing} broken=${report.totals.broken} expected=${expected}`,
  );

  if (report.totals.missing > 0 || report.totals.broken > 0) process.exitCode = 1;
}

main();
