import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const THEME_STORAGE_KEY = 'isDarkMode';

@Component({
    selector: 'app-theme-switcher',
    templateUrl: './theme-switcher.component.html',
    styleUrls: ['./theme-switcher.component.scss'],
    standalone: false
})
export class ThemeSwitcherComponent {
  isDark = false;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    // localStorage, matchMedia and documentElement only exist in the
    // browser; prerendered pages ship with the default (light) theme.
    if (this.isBrowser) {
      this.applyTheme(this.resolveInitialTheme());
    }
  }

  toggleTheme() {
    this.applyTheme(!this.isDark);
    localStorage.setItem(THEME_STORAGE_KEY, String(this.isDark));
  }

  private resolveInitialTheme(): boolean {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'true' || stored === 'false') {
      return stored === 'true';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(isDark: boolean) {
    this.isDark = isDark;
    document.documentElement.classList.toggle('dark', isDark);
  }
}
