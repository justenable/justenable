import { isPlatformBrowser, Location } from '@angular/common';
import {
  afterNextRender,
  Directive,
  DOCUMENT,
  ElementRef,
  inject,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { HydrationService } from '../services/hydration.service';

const REVEAL_CLASS = 'reveal';
const REVEALED_CLASS = 'is-revealed';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
/** Share of the element that must be inside the viewport before it reveals. */
export const REVEAL_THRESHOLD = 0.15;
/** Percent of the viewport height, at the bottom, that does not count as inside. */
export const REVEAL_BOTTOM_MARGIN = 8;

/**
 * Fades/slides an element in when it enters the viewport. The classes are
 * only added in the browser, so prerendered HTML stays fully visible before
 * JavaScript runs. Users who prefer reduced motion get the content
 * immediately with no transition.
 *
 * While the prerendered page is still hydrating, anything the observer
 * would already count as in view is left alone: the visitor has been looking
 * at it, and hiding it to fade it back in would read as a blink. An element
 * that only just crosses the fold, and everything below it, still reveals on
 * scroll; after a client-side navigation every element reveals, because
 * nothing was on screen before.
 *
 * The element a fragment link points into is shown at once, with no rise:
 * the visitor asked for it, and the router measures its scroll from the box
 * as transformed, so an element still rising when it is scrolled to would
 * settle 12px above where it landed. The URL is already set when a page is
 * reached from another page; a same-page link changes it in place.
 */
@Directive({
  selector: '[appReveal]',
  standalone: false,
})
export class RevealDirective implements OnInit, OnDestroy {
  /** Extra transition delay in milliseconds, for staggering siblings. */
  @Input() appRevealDelay = 0;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly hydration = inject(HydrationService);
  private readonly location = inject(Location);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;
  private stopUrlChanges?: VoidFunction;

  ngOnInit(): void {
    if (!this.isBrowser || !this.canAnimate()) {
      return;
    }
    const element = this.host.nativeElement;
    if (this.hydration.hydrating() && this.inView(element)) {
      return;
    }
    element.classList.add(REVEAL_CLASS);
    if (this.appRevealDelay > 0) {
      element.style.setProperty('--reveal-delay', `${this.appRevealDelay}ms`);
    }

    // The observer callback only touches classes, so it can stay outside
    // the zone and avoid a change-detection pass per intersection.
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            element.classList.add(REVEALED_CLASS);
            this.disconnect();
          }
        },
        {
          threshold: REVEAL_THRESHOLD,
          rootMargin: `0px 0px -${REVEAL_BOTTOM_MARGIN}% 0px`,
        }
      );
      this.observer.observe(element);
    });

    // The target's id is bound by the render that creates it, so the current
    // URL is checked once that render is done, still before the first paint.
    afterNextRender(() => this.showIfTargeted(this.location.path(true)), {
      injector: this.injector,
    });
    this.stopUrlChanges = this.location.onUrlChange((url) =>
      this.showIfTargeted(url)
    );
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.stopUrlChanges?.();
  }

  /** Shows the element as it is when the URL's fragment points inside it. */
  private showIfTargeted(url: string): void {
    const fragment = url.split('#')[1];
    const target = fragment ? this.document.getElementById(fragment) : null;
    if (!target || !this.host.nativeElement.contains(target)) {
      return;
    }
    this.host.nativeElement.classList.remove(REVEAL_CLASS);
    this.disconnect();
    this.stopUrlChanges?.();
    this.stopUrlChanges = undefined;
  }

  private canAnimate(): boolean {
    return (
      'IntersectionObserver' in window &&
      !window.matchMedia(REDUCED_MOTION_QUERY).matches
    );
  }

  // The observer's own test, so a sliver over the fold is not "seen": it
  // keeps .reveal and draws when the visitor scrolls to it.
  private inView(element: HTMLElement): boolean {
    const { top, bottom, height } = element.getBoundingClientRect();
    const rootBottom = window.innerHeight * (1 - REVEAL_BOTTOM_MARGIN / 100);
    const visible = Math.min(bottom, rootBottom) - Math.max(top, 0);
    return height > 0 && visible / height >= REVEAL_THRESHOLD;
  }

  private disconnect(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }
}
