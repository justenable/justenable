import { computed, Signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { readStorage } from './storage';

export type LanguageCode = 'af' | 'en' | 'fr' | 'sw' | 'zu';

export interface Language {
  code: LanguageCode;
  /** Endonym: each language names itself, so it can carry its own lang attribute. */
  name: string;
}

export const LANGUAGES: readonly Language[] = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'zu', name: 'isiZulu' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export const LANGUAGE_CODES: readonly LanguageCode[] = LANGUAGES.map(
  (language) => language.code
);

export function isLanguageCode(value: string | null | undefined): value is LanguageCode {
  return LANGUAGE_CODES.includes(value as LanguageCode);
}

/**
 * The active language as a typed signal. ngx-translate's currentLang is a
 * plain string (and undefined before the first use()), so anything outside
 * the five supported codes reads as the default.
 */
export function currentLanguage(translate: TranslateService): Signal<LanguageCode> {
  return computed(() => {
    const lang = translate.currentLang();
    return isLanguageCode(lang) ? lang : DEFAULT_LANGUAGE;
  });
}

export const LANG_STORAGE_KEY = 'lang';

/**
 * Prerendered pages are always English; language preference only exists in
 * the browser. Shared by the app initializer (so translations are loaded
 * before the first, hydrating render) and AppComponent.
 */
export function resolveInitialLang(translate: TranslateService, isBrowser: boolean): LanguageCode {
  if (!isBrowser) {
    return DEFAULT_LANGUAGE;
  }
  const stored = readStorage('local', LANG_STORAGE_KEY);
  if (isLanguageCode(stored)) {
    return stored;
  }
  const browserLang = translate.getBrowserLang();
  if (isLanguageCode(browserLang)) {
    return browserLang;
  }
  return DEFAULT_LANGUAGE;
}
