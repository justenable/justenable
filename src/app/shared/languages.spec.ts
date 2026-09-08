import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { blockStorage } from 'src/testing/storage';
import {
  currentLanguage,
  isLanguageCode,
  LANG_STORAGE_KEY,
  LANGUAGES,
  resolveInitialLang,
} from './languages';

describe('languages', () => {
  it('lists the five locales in fixed order with endonyms', () => {
    expect(LANGUAGES.map((language) => language.code)).toEqual(['af', 'en', 'fr', 'sw', 'zu']);
    expect(LANGUAGES.map((language) => language.name)).toEqual([
      'Afrikaans',
      'English',
      'Français',
      'Kiswahili',
      'isiZulu',
    ]);
  });

  it('recognises only the supported codes', () => {
    expect(isLanguageCode('fr')).toBeTrue();
    expect(isLanguageCode('de')).toBeFalse();
    expect(isLanguageCode(null)).toBeFalse();
    expect(isLanguageCode(undefined)).toBeFalse();
  });

  describe('currentLanguage', () => {
    let translate: TranslateService;

    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [provideTranslateService()] });
      translate = TestBed.inject(TranslateService);
    });

    it('follows the active language and falls back to the default', () => {
      const current = currentLanguage(translate);
      expect(current()).toBe('en');

      translate.use('zu');
      expect(current()).toBe('zu');

      translate.use('de');
      expect(current()).toBe('en');
    });
  });

  describe('resolveInitialLang', () => {
    let translate: TranslateService;

    beforeEach(() => {
      localStorage.removeItem(LANG_STORAGE_KEY);
      TestBed.configureTestingModule({ providers: [provideTranslateService()] });
      translate = TestBed.inject(TranslateService);
    });

    afterEach(() => localStorage.removeItem(LANG_STORAGE_KEY));

    it('is always the default off the browser (prerendered pages are English)', () => {
      localStorage.setItem(LANG_STORAGE_KEY, 'fr');
      expect(resolveInitialLang(translate, false)).toBe('en');
    });

    it('prefers a supported stored language over the browser language', () => {
      localStorage.setItem(LANG_STORAGE_KEY, 'zu');
      spyOn(translate, 'getBrowserLang').and.returnValue('fr');
      expect(resolveInitialLang(translate, true)).toBe('zu');
    });

    it('falls back to the browser language, then the default', () => {
      spyOn(translate, 'getBrowserLang').and.returnValues('fr', 'de');
      expect(resolveInitialLang(translate, true)).toBe('fr');
      localStorage.setItem(LANG_STORAGE_KEY, 'xx');
      expect(resolveInitialLang(translate, true)).toBe('en');
    });

    it('falls through to the browser language when storage is blocked', () => {
      const unblock = blockStorage('localStorage');
      spyOn(translate, 'getBrowserLang').and.returnValue('sw');
      expect(resolveInitialLang(translate, true)).toBe('sw');
      unblock();
    });
  });
});
