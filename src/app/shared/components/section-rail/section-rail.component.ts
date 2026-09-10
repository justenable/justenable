import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  DOCUMENT,
  effect,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { SmoothViewportScroller } from 'src/app/services/smooth-viewport-scroller';
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
 *
 * A click on a rail link starts a smooth scroll that passes every section
 * between here and the destination, and the observer reports each one. Those
 * reports are recorded but not shown: while SmoothViewportScroller says a
 * glide is in flight the rail holds the destination lit, so the lamp settles
 * on the section the visitor asked for instead of running down the list. The
 * held id is dropped when the glide ends, and what the observer saw in the
 * meantime is what the rail then shows.
 */
@Component({
  selector: 'app-section-rail',
  templateUrl: './section-rail.component.html',
  styleUrl: './section-rail.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SectionRailComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) items: ContentsItem[] = [];

  /** What the observer has seen; the rail shows `activeId` instead. */
  private readonly observedId = signal<string | null>(null);
  /** The destination of a glide in flight, held lit until it lands. */
  private readonly heldId = signal<string | null>(null);

  /** The row that is lit and carries aria-current. */
  readonly activeId = computed(() => this.heldId() ?? this.observedId());

  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly scroller = inject(SmoothViewportScroller, { optional: true });
  /** Which headings have reached the line, by section id. */
  private readonly passed = new Set<string>();
  private observer?: IntersectionObserver;

  constructor() {
    // By the time the app has rendered, every section H2 is in the DOM,
    // whether hydrated or freshly created.
    if (this.isBrowser) {
      afterNextRender(() => this.connect());
    }
    // The hold is released by the glide ending, not by the click: the
    // observer's last word about where the page actually stopped is what
    // the rail should show, and it only has that once the scroll is at rest.
    const gliding = this.scroller?.gliding;
    if (gliding) {
      effect(() => {
        if (!gliding()) {
          this.heldId.set(null);
        }
      });
    }
  }

  ngOnChanges(): void {
    this.passed.clear();
    this.heldId.set(null);
    this.observedId.set(this.resolveActive());
    if (this.observer) {
      this.connect();
    }
  }

  /**
   * Lights the section a rail link points at for as long as the scroll to it
   * is running. Called from the template on click, before the router has
   * started the navigation, so the lamp moves in the same frame as the click.
   */
  hold(id: string): void {
    if (this.isBrowser) {
      this.heldId.set(id);
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
    this.observedId.set(this.resolveActive());
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
