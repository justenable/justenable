import { ApplicationRef, DOCUMENT, inject, Injectable } from '@angular/core';

/** Angular stamps the root element of server-rendered HTML with this attribute. */
const SERVER_CONTEXT_SELECTOR = '[ng-server-context]';

/**
 * Whether what is on screen is still the prerendered HTML: the document came
 * from the server and Angular has not yet finished its first stable render.
 * Motion that hides an element in order to reveal it must not run on content
 * the visitor has already been looking at, so RevealDirective asks here.
 */
@Injectable({ providedIn: 'root' })
export class HydrationService {
  private readonly prerendered =
    inject(DOCUMENT).querySelector(SERVER_CONTEXT_SELECTOR) !== null;
  private stable = false;

  constructor() {
    if (this.prerendered) {
      // Angular's own hydration cleanup runs on this same promise.
      inject(ApplicationRef)
        .whenStable()
        .then(() => {
          this.stable = true;
        });
    }
  }

  hydrating(): boolean {
    return this.prerendered && !this.stable;
  }
}
