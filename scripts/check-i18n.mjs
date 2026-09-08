// Verifies the five locale files against each other and against the copy
// rules the templates rely on. Run with `npm run i18n:check`.
//
// - every locale defines exactly the same key set as en.json, with no empty value
// - keys are sorted (localeCompare, the order the files are merged and sorted in)
// - taglines.json mirrors each locale's HOME.SUBTITLE (the footer tagline stack
//   reads the constant, so it must never drift from the files)
// - every *_OUTRO_TEXT.n contains ':' (the reason sheet splits title from note on it)
// - no value carries HTML line breaks or leading/trailing whitespace
//
// An optional directory argument points the check at another set of files
// (scripts/check-i18n.test.mjs uses it for fixtures).
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dir = resolve(process.argv[2] ?? join(process.cwd(), 'src', 'assets', 'i18n'));
const TAGLINES_FILE = 'taglines.json';
const files = readdirSync(dir)
  .filter((f) => f.endsWith('.json') && f !== TAGLINES_FILE)
  .sort();
const locales = Object.fromEntries(
  files.map((f) => [f.replace('.json', ''), JSON.parse(readFileSync(join(dir, f), 'utf8'))])
);

const reference = locales.en;
if (!reference) {
  console.error('en.json is missing');
  process.exit(1);
}
const referenceKeys = Object.keys(reference);
let failed = false;

const fail = (file, problems) => {
  if (!problems.length) return;
  failed = true;
  console.error(`${file}:`);
  for (const p of problems) console.error(`  ${p}`);
};

// Pinned to one locale so the check agrees on every machine and in CI.
const byKey = (a, b) => a.localeCompare(b, 'en');

for (const [locale, translations] of Object.entries(locales)) {
  const order = Object.keys(translations);
  const sorted = [...order].sort(byKey);
  const problems = [
    ...referenceKeys.filter((k) => !(k in translations)).map((k) => `missing    ${k}`),
    ...order.filter((k) => !(k in reference)).map((k) => `extra      ${k}`),
  ];
  if (order.some((k, i) => k !== sorted[i])) {
    problems.push('unsorted   keys are not in localeCompare order');
  }
  for (const [key, raw] of Object.entries(translations)) {
    const value = String(raw);
    if (value.trim() === '') {
      problems.push(`empty      ${key}`);
      continue;
    }
    if (/_OUTRO_TEXT\.\d+$/.test(key) && !value.includes(':')) {
      problems.push(`no colon   ${key} (the reason sheet splits "Title: note" on it)`);
    }
    if (/<br\s*\/?>/i.test(value)) {
      problems.push(`html br    ${key} (use numbered .0/.1 keys and separate <p> elements)`);
    }
    if (value !== value.trim()) {
      problems.push(`whitespace ${key} (leading or trailing whitespace or newline)`);
    }
  }
  fail(`${locale}.json`, problems);
}

const taglinesPath = join(dir, TAGLINES_FILE);
if (!existsSync(taglinesPath)) {
  failed = true;
  console.error(`${TAGLINES_FILE}: missing (expected {locale: HOME.SUBTITLE} for every locale)`);
} else {
  const taglines = JSON.parse(readFileSync(taglinesPath, 'utf8'));
  const problems = [];
  for (const locale of Object.keys(locales)) {
    if (!(locale in taglines)) {
      problems.push(`missing  ${locale}`);
    } else if (taglines[locale] !== locales[locale]['HOME.SUBTITLE']) {
      problems.push(
        `mismatch ${locale}: "${taglines[locale]}" != HOME.SUBTITLE "${locales[locale]['HOME.SUBTITLE']}"`
      );
    }
  }
  for (const locale of Object.keys(taglines)) {
    if (!(locale in locales)) problems.push(`extra    ${locale} (no ${locale}.json)`);
  }
  fail(TAGLINES_FILE, problems);
}

if (failed) {
  process.exit(1);
}
console.log(`i18n ok: ${files.length} locales, ${referenceKeys.length} keys each, taglines in sync`);
