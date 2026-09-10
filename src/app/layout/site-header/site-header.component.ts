import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  DOCUMENT,
  effect,
  ElementRef,
  HostListener,
  inject,
  Injector,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  viewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import { NAV } from 'src/app/shared/navigation';

// Must match the `nav` breakpoint (--breakpoint-nav) in src/styles/theme.scss.
const NAV_BAR_QUERY = '(min-width: 1180px)';
/** Scroll depth past which the header's rule becomes a shadow (`.is-scrolled`). */
export const SCROLLED_OFFSET = 24;
/**
 * Dead band around SCROLLED_OFFSET. A scroll that comes to rest on the
 * threshold, or a glide easing through it, would otherwise flip the shadow on
 * and off for as long as it hovered there; the state has to travel this far
 * back before it releases.
 */
export const SCROLLED_HYSTERESIS = 8;
const SCROLLED_CLASS = 'is-scrolled';

/** What the panel's focus trap cycles through; exported so the spec cannot drift from it. */
export const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]';

/**
 * Sticky header: brand, desktop nav (>= 1180px), language switcher, theme
 * toggle and, below 1180px, the hamburger that opens the panel. The panel's
 * open state lives in LayoutService so AppComponent can make main and footer
 * inert while it is open.
 */
@Component({
  selector: 'app-site-header',
  standalone: false,
  templateUrl: './site-header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./site-header.component.scss'],
})
export class SiteHeaderComponent implements OnDestroy {
  readonly nav = NAV;
  readonly layout = inject(LayoutService);

  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  private readonly burger = viewChild<ElementRef<HTMLButtonElement>>('burger');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly navigation: Subscription;
  private readonly navBar?: MediaQueryList;
  // The panel only exists below the nav breakpoint; widening past it must
  // also release the inert main and the scroll lock.
  private readonly onNavBarChange = (event: MediaQueryListEvent) => {
    if (event.matches) {
      this.layout.closeMenu();
    }
  };
  private scrolled = false;
  private scrollFrame = 0;
  // Toggles a class only, so it runs outside the zone: a change-detection
  // pass per scroll event would be wasted work. The read is deferred to the
  // next frame so a burst of scroll events costs one layout read, not one
  // per event, which is what keeps a smooth scroll from stuttering.
  private readonly onScroll = () => {
    if (this.scrollFrame) {
      return;
    }
    this.scrollFrame = requestAnimationFrame(() => {
      this.scrollFrame = 0;
      this.applyScrolled();
    });
  };

  constructor() {
    this.navigation = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.layout.closeMenu());

    effect(() => {
      const open = this.layout.menuOpen();
      if (this.isBrowser) {
        this.document.body.style.overflow = open ? 'hidden' : '';
      }
    });

    if (this.isBrowser) {
      this.navBar = window.matchMedia(NAV_BAR_QUERY);
      this.navBar.addEventListener('change', this.onNavBarChange);
      // A page can open already scrolled (a fragment link), so read once now.
      this.applyScrolled();
      this.zone.runOutsideAngular(() =>
        window.addEventListener('scroll', this.onScroll, { passive: true })
      );
    }
  }

  ngOnDestroy(): void {
    this.navigation.unsubscribe();
    this.navBar?.removeEventListener('change', this.onNavBarChange);
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onScroll);
      cancelAnimationFrame(this.scrollFrame);
      this.document.body.style.overflow = '';
    }
  }

  // Past the offset it floats; it only settles again once the page is back
  // above the dead band, so the shadow cannot flicker on the threshold.
  private applyScrolled(): void {
    const y = window.scrollY;
    const scrolled = this.scrolled
      ? y > SCROLLED_OFFSET - SCROLLED_HYSTERESIS
      : y > SCROLLED_OFFSET;
    if (scrolled === this.scrolled) {
      return;
    }
    this.scrolled = scrolled;
    this.host.nativeElement.classList.toggle(SCROLLED_CLASS, scrolled);
  }

  toggleMenu(): void {
    if (this.layout.menuOpen()) {
      this.closeMenu(true);
    } else {
      this.openMenu();
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    if (this.layout.menuOpen()) {
      this.closeMenu(true);
    }
  }

  // Tab is trapped inside the panel; Escape is the way out.
  // Angular types a keyed host listener's $event as Event, so narrow here.
  @HostListener('keydown.tab', ['$event'])
  @HostListener('keydown.shift.tab', ['$event'])
  onTab(event: Event): void {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }
    const panel = this.panel()?.nativeElement;
    if (!panel || !panel.contains(event.target as Node)) {
      return;
    }
    const focusables = this.panelFocusables();
    if (focusables.length === 0) {
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = this.document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  onClickOutside(event: MouseEvent): void {
    // The hamburger toggles on its own click; do not close first and reopen.
    if (this.burger()?.nativeElement.contains(event.target as Node)) {
      return;
    }
    this.layout.closeMenu();
  }

  private openMenu(): void {
    this.layout.openMenu();
    afterNextRender(() => this.panelFocusables()[0]?.focus(), {
      injector: this.injector,
    });
  }

  private closeMenu(returnFocus: boolean): void {
    this.layout.closeMenu();
    if (returnFocus) {
      this.burger()?.nativeElement.focus();
    }
  }

  private panelFocusables(): HTMLElement[] {
    const panel = this.panel()?.nativeElement;
    if (!panel) {
      return [];
    }
    return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (element) => element.tabIndex >= 0
    );
  }
}
