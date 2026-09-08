import { Injectable, signal } from '@angular/core';

// Single source of truth for the mobile navigation panel. The header opens
// and closes it; AppComponent reads it to make main and footer inert.
@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly menuOpen = signal(false);

  openMenu(): void {
    this.menuOpen.set(true);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
