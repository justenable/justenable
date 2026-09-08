import { TestBed } from '@angular/core/testing';
import { blockStorage } from 'src/testing/storage';
import { THEME_COLOR, THEME_STORAGE_KEY, ThemeService } from './theme.service';

type SchemeChangeListener = (event: { matches: boolean }) => void;

describe('ThemeService', () => {
  const metaTags: HTMLMetaElement[] = [];
  let onSchemeChange: SchemeChangeListener | undefined;

  // Fake the OS colour-scheme query so the tests do not depend on the host's
  // preference; every other query passes through to the real matchMedia.
  function create(stored?: string, osPrefersDark = false): ThemeService {
    if (stored === undefined) {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, stored);
    }
    onSchemeChange = undefined;
    const matchMedia = window.matchMedia.bind(window);
    const darkScheme = {
      matches: osPrefersDark,
      addEventListener: (_type: string, listener: SchemeChangeListener) => {
        onSchemeChange = listener;
      },
      removeEventListener: () => undefined,
    };
    spyOn(window, 'matchMedia').and.callFake((query: string) =>
      query === '(prefers-color-scheme: dark)'
        ? (darkScheme as unknown as MediaQueryList)
        : matchMedia(query)
    );
    TestBed.configureTestingModule({});
    return TestBed.inject(ThemeService);
  }

  function fireSchemeChange(matches: boolean): void {
    expect(onSchemeChange).toBeDefined();
    onSchemeChange?.({ matches });
  }

  beforeEach(() => {
    // Mirror the two media-scoped tags index.html ships.
    for (const media of ['(prefers-color-scheme: light)', '(prefers-color-scheme: dark)']) {
      const tag = document.createElement('meta');
      tag.name = 'theme-color';
      tag.media = media;
      tag.content = 'unset';
      document.head.appendChild(tag);
      metaTags.push(tag);
    }
  });

  afterEach(() => {
    metaTags.splice(0).forEach((tag) => tag.remove());
    document.documentElement.classList.remove('dark');
    localStorage.removeItem(THEME_STORAGE_KEY);
  });

  it('initializes from the stored preference', () => {
    const service = create('true');
    expect(service.isDark()).toBeTrue();
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
  });

  it('follows a dark OS colour scheme when nothing is stored', () => {
    const service = create(undefined, true);
    expect(service.isDark()).toBeTrue();
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
    expect(metaTags.map((tag) => tag.content)).toEqual([
      THEME_COLOR.dark,
      THEME_COLOR.dark,
    ]);
  });

  it('follows a light OS colour scheme when nothing is stored', () => {
    const service = create(undefined, false);
    expect(service.isDark()).toBeFalse();
    expect(document.documentElement.classList.contains('dark')).toBeFalse();
  });

  it('tracks OS colour-scheme changes while nothing is stored', () => {
    const service = create(undefined, false);
    fireSchemeChange(true);
    expect(service.isDark()).toBeTrue();
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
    expect(metaTags.map((tag) => tag.content)).toEqual([
      THEME_COLOR.dark,
      THEME_COLOR.dark,
    ]);
    // An OS change is not a stored choice.
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('ignores OS colour-scheme changes once a preference is stored', () => {
    const service = create('false');
    fireSchemeChange(true);
    expect(service.isDark()).toBeFalse();
    expect(document.documentElement.classList.contains('dark')).toBeFalse();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('false');
  });

  it('toggle flips the theme, the dark class and persists the choice', () => {
    const service = create('false');

    service.toggle();
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('true');

    service.toggle();
    expect(service.theme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBeFalse();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('false');
  });

  it('set applies an explicit theme', () => {
    const service = create('false');
    service.set('dark');
    expect(service.isDark()).toBeTrue();
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
  });

  it('writes the theme colour into both meta tags on init and on toggle', () => {
    const service = create('false');
    expect(metaTags.map((tag) => tag.content)).toEqual([
      THEME_COLOR.light,
      THEME_COLOR.light,
    ]);

    service.toggle();
    expect(metaTags.map((tag) => tag.content)).toEqual([
      THEME_COLOR.dark,
      THEME_COLOR.dark,
    ]);
  });

  it('boots from the OS colour scheme without throwing when storage is blocked', () => {
    const unblock = blockStorage('localStorage');
    onSchemeChange = undefined;
    const matchMedia = window.matchMedia.bind(window);
    spyOn(window, 'matchMedia').and.callFake((query: string) =>
      query === '(prefers-color-scheme: dark)'
        ? ({ matches: true, addEventListener: () => undefined } as unknown as MediaQueryList)
        : matchMedia(query)
    );
    TestBed.configureTestingModule({});

    let service!: ThemeService;
    expect(() => (service = TestBed.inject(ThemeService))).not.toThrow();
    expect(service.isDark()).toBeTrue();
    expect(() => service.set('light')).not.toThrow();
    expect(service.isDark()).toBeFalse();
    unblock();
  });
});
