import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

const REVEAL_CLASS = 'reveal';
const REVEALED_CLASS = 'is-revealed';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Fades/slides an element in when it enters the viewport. The classes are
 * only added in the browser, so prerendered HTML stays fully visible before
 * JavaScript runs. Users who prefer reduced motion get the content
 * immediately with no transition.
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
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (!this.isBrowser || !this.canAnimate()) {
      return;
    }
    const element = this.host.nativeElement;
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
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
      );
      this.observer.observe(element);
    });
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private canAnimate(): boolean {
    return (
      'IntersectionObserver' in window &&
      !window.matchMedia(REDUCED_MOTION_QUERY).matches
    );
  }

  private disconnect(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }
}
