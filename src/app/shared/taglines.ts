import taglines from 'src/assets/i18n/taglines.json';
import { LanguageCode } from './languages';

// The footer tagline stack shows all five translations at once, so the
// values live in one JSON file that scripts/check-i18n.mjs asserts against
// each locale's HOME.SUBTITLE. Importing the JSON means they cannot drift.
export const TAGLINES: Readonly<Record<LanguageCode, string>> = taglines;
