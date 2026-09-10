import { Location } from '@angular/common';
import { Component, DOCUMENT, inject } from '@angular/core';

// First element inside app-root; its target is main#main in app.component.html.
@Component({
  selector: 'app-skip-link',
  standalone: false,
  templateUrl: './skip-link.component.html',
  styleUrls: ['./skip-link.component.scss'],
})
export class SkipLinkComponent {
  // The href carries the current path because <base href="/"> would turn a
  // bare "#main" into a navigation to /#main (the home page) on every inner
  // route; the click handler is what actually moves focus.
  readonly location = inject(Location);

  private readonly document = inject(DOCUMENT);

  skip(event: Event): void {
    event.preventDefault();
    const main = this.document.getElementById('main');
    if (!main) {
      return;
    }
    // preventScroll, because focus's own scroll-into-view is instant and
    // would cut the smooth one short; scroll-behavior on the root is what
    // makes this a glide, and reduced motion turns it back into a jump.
    main.scrollIntoView();
    main.focus({ preventScroll: true });
  }
}
