import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  DOCUMENT,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ContentsItem } from '../title-block/title-block.component';

/**
 * The observer's root: everything above the line at 45% of the viewport
 * height, so a heading "intersects" once it has reached the upper middle
 * of the screen. One line rather than a band, because a band can be
 * jumped over in a single frame (a fragment link, PageDown, a scrollbar
 * drag) without the observer ever reporting the heading; a region open
 * above cannot be crossed without changing sides.
 */
export const RAIL_ROOT_MARGIN = '100000px 0px -55% 0px';

/**
 * The service pages' alarm list: every section with its tag, the lamp lit on
 * the one in view. Shown from `xl` beside the sections (the title block's
 * contents row is the in-page navigation below that), sticky under the
 * header. The active section is read from an IntersectionObserver over the
 * sections' H2 elements, in the browser only; the server and the first
 * client render light the first item.
 */
@Component({
  selector: 'app-section-rail',
  templateUrl: './section-rail.component.html',
  styleUrl: './section-rail.component.scss',
  standalone: false,
})
export class SectionRailComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) items: ContentsItem[] = [];

  readonly activeId = signal<string | null>(null);

  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  /** Which headings have reached the line, by section id. */
  private readonly passed = new Set<string>();
  private observer?: IntersectionObserver;

  constructor() {
    // By the time the app has rendered, every section H2 is in the DOM,
    // whether hydrated or freshly created.
    if (this.isBrowser) {
      afterNextRender(() => this.connect());
    }
  }

  ngOnChanges(): void {
    this.passed.clear();
    this.activeId.set(this.resolveActive());
    if (this.observer) {
      this.connect();
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private connect(): void {
    this.disconnect();
    this.passed.clear();
    this.observer = new IntersectionObserver(
      (entries) => this.onEntries(entries),
      { threshold: 0, rootMargin: RAIL_ROOT_MARGIN }
    );
    for (const item of this.items) {
      const heading = this.document.getElementById(item.id);
      if (heading) {
        this.observer.observe(heading);
      }
    }
  }

  private disconnect(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }

  private onEntries(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this.passed.add(entry.target.id);
      } else {
        this.passed.delete(entry.target.id);
      }
    }
    this.activeId.set(this.resolveActive());
  }

  // The section being read is the last one whose heading has passed the
  // line. Before any has (the title block is still on screen), the first
  // section is the one coming up.
  private resolveActive(): string | null {
    let active = this.items.length ? this.items[0].id : null;
    for (const item of this.items) {
      if (this.passed.has(item.id)) {
        active = item.id;
      }
    }
    return active;
  }
}
