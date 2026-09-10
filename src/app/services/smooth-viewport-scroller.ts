import { DOCUMENT, ViewportScroller } from '@angular/common';
import { inject, Injectable, NgZone, signal } from '@angular/core';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * How long after the last scroll movement a glide counts as finished. Chrome
 * emits no "smooth scroll ended" event, so rest is inferred: two consecutive
 * frames at the same offset, confirmed by this quiet period.
 */
export const GLIDE_REST_MS = 120;

/**
 * A glide is abandoned if it has not arrived by now, so a scroll the browser
 * silently clamped (a target below the last scrollable pixel) can never leave
 * the rail suppressed for good.
 */
export const GLIDE_TIMEOUT_MS = 1200;

/**
 * The router's scroller, replaced so in-page navigation glides.
 *
 * Angular's BrowserViewportScroller has two defects for this site. It calls
 * `window.scrollTo` with no `behavior`, and it then calls `focus()` on the
 * anchor, whose own scroll-into-view aborts the smooth scroll roughly 400px
 * short of the target (measured: a rail link to a-03 settled at 1152 instead
 * of 1542). It also passes the element's `rect.left`, asking for a horizontal
 * scroll no page here can satisfy.
 *
 * So: scroll vertically only, with `behavior: 'smooth'` unless the visitor
 * prefers reduced motion, and focus the heading without letting focus scroll.
 * `gliding()` is true while a scroll this service started is in flight, which
 * is what lets the section rail settle on the destination instead of lighting
 * every section the glide passes through.
 *
 * Only `scrollToAnchor` glides. Whole-page moves (`scrollToPosition`) are
 * instant unless a caller asks otherwise; see that method for why.
 */
@Injectable()
export class SmoothViewportScroller extends ViewportScroller {
  /** True while a scroll started here is still moving. */
  readonly gliding = signal(false);

  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly window = this.document.defaultView;
  private offset: () => [number, number] = () => [0, 0];
  private restTimer?: ReturnType<typeof setTimeout>;
  private giveUpTimer?: ReturnType<typeof setTimeout>;
  private lastOffset = -1;

  setOffset(offset: [number, number] | (() => [number, number])): void {
    this.offset = Array.isArray(offset) ? () => offset : offset;
  }

  getScrollPosition(): [number, number] {
    return this.window ? [this.window.scrollX, this.window.scrollY] : [0, 0];
  }

  /**
   * The router calls this for the top of a newly opened page and, on
   * popstate, for a restored position. Neither is a glide: a page you have
   * not seen has nothing to glide past, and gliding to its top would show
   * the previous page's content sliding away under the new one. The router
   * only passes `behavior: 'instant'` on the popstate branch, so the
   * imperative forward navigation arrives here with no options at all and
   * the default must be instant rather than this service's glide.
   *
   * Popstate with a fragment is the one case that needs more than a jump.
   * `scrollPositionRestoration: 'top'` makes the router ask for [0, 0]
   * before `anchorScrolling` can act, so going Back to /automation#a-03
   * would land at the top of the page with the heading 1600px away. When
   * the URL names a live element, that element is the restored position.
   */
  scrollToPosition(position: [number, number], options?: ScrollOptions): void {
    if (!this.window) {
      return;
    }
    const behavior = this.behavior(options?.behavior ?? 'instant');
    const restored = this.restoredAnchor(position);
    if (restored) {
      this.scrollToAnchor(restored, { behavior });
      return;
    }
    this.window.scrollTo({ top: position[1], left: position[0], behavior });
    if (behavior === 'smooth') {
      this.watchGlide();
    }
  }

  /**
   * The fragment of the current URL, when this is a restore to the top of a
   * page whose URL names a heading that exists. Only the top is treated this
   * way: a real restored offset (`scrollPositionRestoration: 'enabled'`) is
   * already the position the visitor left, and must be honoured as given.
   */
  private restoredAnchor(position: [number, number]): string | null {
    if (position[0] !== 0 || position[1] !== 0) {
      return null;
    }
    const fragment = decodeURIComponent(this.window?.location.hash.slice(1) ?? '');
    return fragment && this.findAnchor(fragment) ? fragment : null;
  }

  /**
   * Scrolls the heading with the given id to the anchor offset below the
   * viewport top and focuses it. Both halves matter: the offset is what puts
   * the heading clear of the sticky header, and the focus is what sends a
   * screen reader and the keyboard to the section the visitor asked for.
   */
  scrollToAnchor(target: string, options?: ScrollOptions): void {
    const element = this.findAnchor(target);
    if (!element || !this.window) {
      return;
    }
    const top = element.getBoundingClientRect().top + this.window.scrollY - this.offset()[1];
    const behavior = this.behavior(options?.behavior ?? 'smooth');
    // Left is deliberately absent: the element's own rect.left would ask for
    // a horizontal scroll, and no page here scrolls sideways.
    this.window.scrollTo({ top, behavior });
    // preventScroll is the fix: focus's own scroll-into-view would otherwise
    // interrupt the glide and land the visitor short of the heading.
    element.focus({ preventScroll: true });
    if (behavior === 'smooth') {
      this.watchGlide();
    }
  }

  setHistoryScrollRestoration(scrollRestoration: 'auto' | 'manual'): void {
    if (this.window) {
      try {
        this.window.history.scrollRestoration = scrollRestoration;
      } catch {
        // Sandboxed frames and some test runners forbid it; scrolling still works.
      }
    }
  }

  /**
   * The preference wins over the caller: a visitor who asked for reduced
   * motion gets the instant jump even where the code requests a glide, and
   * `fallback` is only consulted when motion is allowed.
   */
  private behavior(fallback: ScrollBehavior): ScrollBehavior {
    return this.prefersReducedMotion() ? 'instant' : fallback;
  }

  private prefersReducedMotion(): boolean {
    return !!this.window?.matchMedia(REDUCED_MOTION_QUERY).matches;
  }

  /**
   * Polls the offset until it has stopped moving for GLIDE_REST_MS. Outside
   * the zone: a change-detection pass per frame of a scroll would be waste,
   * and the one signal write that matters re-enters it.
   */
  private watchGlide(): void {
    clearTimeout(this.restTimer);
    clearTimeout(this.giveUpTimer);
    this.lastOffset = -1;
    if (!this.gliding()) {
      this.zone.run(() => this.gliding.set(true));
    }
    this.zone.runOutsideAngular(() => {
      this.giveUpTimer = setTimeout(() => this.settle(), GLIDE_TIMEOUT_MS);
      this.tick();
    });
  }

  private tick(): void {
    if (!this.window) {
      return;
    }
    const offset = Math.round(this.window.scrollY);
    if (offset === this.lastOffset) {
      this.restTimer = setTimeout(() => this.settle(), GLIDE_REST_MS);
      return;
    }
    this.lastOffset = offset;
    this.restTimer = setTimeout(() => this.tick(), 50);
  }

  private settle(): void {
    clearTimeout(this.restTimer);
    clearTimeout(this.giveUpTimer);
    this.restTimer = undefined;
    this.giveUpTimer = undefined;
    this.lastOffset = -1;
    this.zone.run(() => this.gliding.set(false));
  }

  private findAnchor(target: string): HTMLElement | null {
    const byId = this.document.getElementById(target);
    if (byId) {
      return byId;
    }
    const [byName] = Array.from(this.document.getElementsByName(target));
    return (byName as HTMLElement) ?? null;
  }
}
