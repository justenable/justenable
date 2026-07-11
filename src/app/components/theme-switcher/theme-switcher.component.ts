import { Component } from '@angular/core';

const THEME_STORAGE_KEY = 'isDarkMode';

@Component({
    selector: 'app-theme-switcher',
    templateUrl: './theme-switcher.component.html',
    styleUrls: ['./theme-switcher.component.scss'],
    standalone: false
})
export class ThemeSwitcherComponent {
  isDark = false;

  constructor() {
    this.applyTheme(this.resolveInitialTheme());
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
