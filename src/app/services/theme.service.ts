import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  DOCUMENT,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { readStorage, writeStorage } from '../shared/storage';

export type Theme = 'light' | 'dark';

// Kept from the previous implementation so returning visitors keep their
// stored preference. Values are the strings 'true' / 'false'.
export const THEME_STORAGE_KEY = 'isDarkMode';

// Browser chrome colour per theme: the sticky header surface, not the canvas,
// because the header is what touches the browser UI. Must match the inline
// pre-paint script in index.html.
export const THEME_COLOR: Readonly<Record<Theme, string>> = {
  light: '#FFFFFF',
  dark: '#202326',
};

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<Theme>('light');
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    // Prerendered pages ship light; the inline script in index.html applies
    // the stored/OS theme before first paint, this keeps the signal in sync.
    if (!this.isBrowser) {
      return;
    }
    const scheme = window.matchMedia(DARK_SCHEME_QUERY);
    this.apply(this.storedTheme() ?? (scheme.matches ? 'dark' : 'light'));
    scheme.addEventListener('change', (event) => {
      if (this.storedTheme() === null) {
        this.apply(event.matches ? 'dark' : 'light');
      }
    });
  }

  toggle(): void {
    this.set(this.isDark() ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.apply(theme);
    if (this.isBrowser) {
      writeStorage('local', THEME_STORAGE_KEY, String(theme === 'dark'));
    }
  }

  private storedTheme(): Theme | null {
    const stored = readStorage('local', THEME_STORAGE_KEY);
    return stored === 'true' ? 'dark' : stored === 'false' ? 'light' : null;
  }

  // color-scheme itself comes from the stylesheet (:root / .dark in tokens.scss).
  private apply(theme: Theme): void {
    this.theme.set(theme);
    this.document.documentElement.classList.toggle('dark', theme === 'dark');
    this.syncThemeColor(theme);
  }

  // Both <meta name="theme-color"> tags carry a media attribute for the OS
  // preference; a manual toggle must override whichever one is active, so
  // both get the same value.
  private syncThemeColor(theme: Theme): void {
    const tags = this.document.querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"]'
    );
    tags.forEach((tag) => tag.setAttribute('content', THEME_COLOR[theme]));
  }
}
