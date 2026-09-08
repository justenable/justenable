// Exercises every rule in check-i18n.mjs against throwaway fixtures. Run with
// `npm run test:scripts`.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = join(dirname(fileURLToPath(import.meta.url)), 'check-i18n.mjs');
const LOCALES = ['af', 'en', 'fr', 'sw', 'zu'];

function baseKeys(locale) {
  return {
    'GLOBAL.AUTOMATION_OUTRO_TEXT.0': `Title ${locale}: note`,
    'HOME.SUBTITLE': `Tagline ${locale}`,
    'SHEET.NO': 'No',
  };
}

/**
 * Writes the five locale files plus taglines.json and runs the check.
 * `edit(locale, keys)` may return replacement keys for one locale;
 * `taglines` replaces the generated taglines object (null skips the file);
 * `skip` omits one locale file entirely.
 */
function run({ edit = (_locale, keys) => keys, taglines, skip } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'check-i18n-'));
  try {
    const generatedTaglines = {};
    for (const locale of LOCALES) {
      const keys = edit(locale, baseKeys(locale));
      generatedTaglines[locale] = keys['HOME.SUBTITLE'];
      if (locale !== skip) {
        writeFileSync(join(dir, `${locale}.json`), JSON.stringify(keys, null, '\t'));
      }
    }
    if (taglines !== null) {
      writeFileSync(
        join(dir, 'taglines.json'),
        JSON.stringify(taglines ?? generatedTaglines, null, '\t')
      );
    }
    return spawnSync(process.execPath, [script, dir], { encoding: 'utf8' });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function only(locale, change) {
  return (current, keys) => (current === locale ? change(keys) : keys);
}

test('passes a consistent set of locales', () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^i18n ok: 5 locales, 3 keys each, taglines in sync/);
});

const failures = [
  {
    name: 'a key missing from one locale',
    options: {
      edit: only('fr', (keys) => {
        const copy = { ...keys };
        delete copy['SHEET.NO'];
        return copy;
      }),
    },
    stderr: /fr\.json:\n {2}missing {4}SHEET\.NO/,
  },
  {
    name: 'a key that en.json does not have',
    options: { edit: only('af', (keys) => ({ ...keys, 'ZZZ.EXTRA': 'x' })) },
    stderr: /af\.json:\n {2}extra {6}ZZZ\.EXTRA/,
  },
  {
    name: 'keys out of localeCompare order',
    options: {
      edit: only('af', (keys) => ({
        'SHEET.NO': keys['SHEET.NO'],
        'GLOBAL.AUTOMATION_OUTRO_TEXT.0': keys['GLOBAL.AUTOMATION_OUTRO_TEXT.0'],
        'HOME.SUBTITLE': keys['HOME.SUBTITLE'],
      })),
    },
    stderr: /af\.json:\n {2}unsorted {3}keys/,
  },
  {
    name: 'an empty value',
    options: { edit: only('sw', (keys) => ({ ...keys, 'SHEET.NO': '  ' })) },
    stderr: /sw\.json:\n {2}empty {6}SHEET\.NO/,
  },
  {
    name: 'a reason-sheet entry without a colon',
    options: {
      edit: only('zu', (keys) => ({ ...keys, 'GLOBAL.AUTOMATION_OUTRO_TEXT.0': 'Title note' })),
    },
    stderr: /zu\.json:\n {2}no colon {3}GLOBAL\.AUTOMATION_OUTRO_TEXT\.0/,
  },
  {
    name: 'an HTML line break',
    options: { edit: only('sw', (keys) => ({ ...keys, 'SHEET.NO': 'No<br />1' })) },
    stderr: /sw\.json:\n {2}html br {4}SHEET\.NO/,
  },
  {
    name: 'trailing whitespace',
    options: { edit: only('sw', (keys) => ({ ...keys, 'SHEET.NO': 'No\n' })) },
    stderr: /sw\.json:\n {2}whitespace SHEET\.NO/,
  },
  {
    name: 'a tagline that drifted from HOME.SUBTITLE',
    options: { taglines: { af: 'drifted', en: 'Tagline en', fr: 'Tagline fr', sw: 'Tagline sw', zu: 'Tagline zu' } },
    stderr: /taglines\.json:\n {2}mismatch af:/,
  },
  {
    name: 'a locale missing from taglines.json',
    options: { taglines: { en: 'Tagline en', fr: 'Tagline fr', sw: 'Tagline sw', zu: 'Tagline zu' } },
    stderr: /taglines\.json:\n {2}missing {2}af/,
  },
  {
    name: 'a tagline for a locale that has no file',
    options: {
      taglines: { af: 'Tagline af', de: 'x', en: 'Tagline en', fr: 'Tagline fr', sw: 'Tagline sw', zu: 'Tagline zu' },
    },
    stderr: /taglines\.json:\n {2}extra {4}de \(no de\.json\)/,
  },
  {
    name: 'a missing taglines.json',
    options: { taglines: null },
    stderr: /^taglines\.json: missing/,
  },
  {
    name: 'a missing en.json',
    options: { skip: 'en' },
    stderr: /^en\.json is missing/,
  },
];

for (const { name, options, stderr } of failures) {
  test(`fails on ${name}`, () => {
    const result = run(options);
    assert.equal(result.status, 1, `expected exit 1\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
    assert.match(result.stderr, stderr);
  });
}
